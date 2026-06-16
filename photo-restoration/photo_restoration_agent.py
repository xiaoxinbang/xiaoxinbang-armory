"""
孝心帮 · 老照片修复引擎 v2.0
==============================
取各家开源之长，做不输付费的效果

模型整合：
  - GFP-GAN v1.4: 人脸修复 (TencentARC)
  - Real-ESRGAN: 真实场景超分 (xinntao)
  - 传统CV管线: 色彩校正/去噪/锐化/修补

pipeline:
  输入 → 色彩校正 → 划痕修补 → GFP-GAN人脸 → 超分 → 最终抛光 → 输出
"""

import argparse
import os
import sys
import time
import json
from pathlib import Path

# ── 兼容层：新版本 torchvision 兼容 old imports ──
try:
    import torchvision.transforms._functional_tensor as _ft
    import torchvision.transforms as _transforms
    _transforms.functional_tensor = _ft
    sys.modules['torchvision.transforms.functional_tensor'] = _ft
except Exception:
    pass

import cv2
import numpy as np
from PIL import Image
import torch

# ── Windows 终端 ──
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[孝心帮] 修复引擎 v2.0 启动 | 设备: {DEVICE}")

# ── 国内镜像（GitHub下载慢，用镜像加速） ──
os.environ.setdefault("HF_ENDPOINT", "https://hf-mirror.com")
# facexlib 和 gfpgan 都从 HuggingFace 镜像下载
os.environ.setdefault("BASICSR_HF_ENDPOINT", "https://hf-mirror.com")

# ═══════════════════════════════════════════════════════════════
# 1. 传统 CV 工具集
# ═══════════════════════════════════════════════════════════════

def auto_white_balance(img):
    """灰度世界白平衡"""
    avg = img.mean(axis=(0, 1)).astype(np.float64)
    avg_g = avg[1]
    scale = avg_g / avg
    img = img.astype(np.float64) * scale.reshape(1, 1, 3)
    return np.clip(img, 0, 255).astype(np.uint8)

def clahe_enhance(img):
    """自适应直方图均衡"""
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    l = clahe.apply(l)
    return cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2BGR)

def denoise(img, strength=5):
    """非局部均值去噪"""
    return cv2.fastNlMeansDenoisingColored(img, None, strength, strength, 7, 21)

def unsharp(img, strength=0.4):
    """USM锐化"""
    blurred = cv2.GaussianBlur(img, (0, 0), 3)
    return cv2.addWeighted(img, 1 + strength, blurred, -strength, 0)

def adjust_saturation(img, factor=1.15):
    """饱和度调整（老照片普遍褪色）"""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * factor, 0, 255)
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

def adjust_brightness(img, alpha=1.05, beta=5):
    """亮度和对比度"""
    return cv2.convertScaleAbs(img, alpha=alpha, beta=beta)

def inpaint_scratch(img):
    """划痕/破损检测 + 修补"""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 20, 60)
    kernel = np.ones((3, 3), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=2)
    mask = edges
    if cv2.countNonZero(mask) > 50:
        return cv2.inpaint(img, mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)
    return img

def smart_resize(img, max_pixels=1500_000):
    """如果图片太大，先缩小到合理范围（加快AI处理速度，后面再超分）"""
    h, w = img.shape[:2]
    if h * w > max_pixels:
        scale = np.sqrt(max_pixels / (h * w))
        new_w, new_h = int(w * scale), int(h * scale)
        return cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
    return img

# ═══════════════════════════════════════════════════════════════
# 2. 损伤分析器
# ═══════════════════════════════════════════════════════════════

def analyze_damage(img):
    """分析损伤，返回严重度分数"""
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    blur_score = max(0, 1 - cv2.Laplacian(gray, cv2.CV_64F).var() / 500)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    fade_score = max(0, 1 - np.mean(hsv[:, :, 1]) / 100)
    median = cv2.medianBlur(gray, 5)
    noise_score = min(1, np.mean(np.abs(gray.astype(float) - median.astype(float))) / 30)
    blur_bright = cv2.GaussianBlur(gray, (15, 15), 0)
    stain_score = min(1, np.sum(np.abs(blur_bright - np.mean(blur_bright)) > 2 * np.std(blur_bright)) / (w * h) * 3)

    edges = cv2.Canny(gray, 30, 100)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=50, minLineLength=max(w,h)//10, maxLineGap=5)
    scratch_score = min(1, (len(lines) if lines is not None else 0) * 100 / (w * h) / 5)

    print(f"  [分析] 模糊:{blur_score:.2f} 褪色:{fade_score:.2f} 噪点:{noise_score:.2f} 划痕:{scratch_score:.2f} 污渍:{stain_score:.2f}")

    return {
        "needs_inpaint": scratch_score > 0.25 or stain_score > 0.25,
        "needs_denoise": blur_score > 0.35 or noise_score > 0.25,
        "needs_color": fade_score > 0.25,
        "needs_face": True,  # 有人脸就增强
        "needs_sr": blur_score > 0.5 or (fade_score > 0.4 and noise_score > 0.3),
        "severity": max(blur_score, fade_score, noise_score, scratch_score, stain_score),
    }

# ═══════════════════════════════════════════════════════════════
# 3. AI 模型管理器（延迟加载）
# ═══════════════════════════════════════════════════════════════

class AIModels:
    """统一管理所有AI模型，用时才加载，缓存不重复"""
    _inst = None
    _cache = {}

    def __new__(cls):
        if cls._inst is None:
            cls._inst = super().__new__(cls)
        return cls._inst

    @staticmethod
    def _resolve_model_path(name):
        """模型文件存放路径"""
        models_dir = Path(__file__).parent / "models"
        models_dir.mkdir(parents=True, exist_ok=True)
        return models_dir

    # ── GFP-GAN ──
    def get_gfpgan(self):
        if "gfpgan" in self._cache:
            return self._cache["gfpgan"]

        # 检查模型文件是否已存在（避免下载阻塞）
        model_paths = [
            os.path.expanduser("~/.cache/gfpgan/GFPGANv1.4.pth"),
            os.path.join(os.path.dirname(__file__), "models", "GFPGANv1.4.pth"),
        ]
        # 也检查 facexlib 模型
        facex_weight = os.path.expanduser("~/.cache/facexlib/detection_Resnet50_Final.pth")
        if not os.path.exists(facex_weight):
            print("[模型]   -> GFP-GAN 模型未下载（首次需下载约500MB）")
            print("[模型]   -> 先用传统CV修复，模型下载后自动启用")
            return None

        print("[模型] 加载 GFP-GAN v1.4...")
        try:
            from gfpgan import GFPGANer
            mgr = GFPGANer(
                model_path="https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth",
                upscale=1, arch="clean", channel_multiplier=2,
                bg_upsampler=None, device=DEVICE
            )
            self._cache["gfpgan"] = mgr
            print("[模型]   -> GFP-GAN v1.4 就绪")
            return mgr
        except Exception as e:
            print(f"[模型]   -> GFP-GAN 加载失败: {e}")
        return None

    # ── Real-ESRGAN ──
    def get_realesrgan(self):
        if "realesrgan" in self._cache:
            return self._cache["realesrgan"]
        print("[模型] 加载 Real-ESRGAN...")
        try:
            from realesrgan import RealESRGANer
            from basicsr.archs.rrdbnet_arch import RRDBNet
            model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64,
                           num_block=23, num_grow_ch=32, scale=4)
            mgr = RealESRGANer(
                scale=4, model_path="https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth",
                model=model, tile=400, tile_pad=10, pre_pad=0, device=DEVICE
            )
            self._cache["realesrgan"] = mgr
            print("[模型]   -> Real-ESRGAN 就绪")
            return mgr
        except Exception as e:
            print(f"[模型]   -> Real-ESRGAN 加载失败: {e}")
        return None


# ═══════════════════════════════════════════════════════════════
# 4. 人脸增强（GFP-GAN + 传统兜底）
# ═══════════════════════════════════════════════════════════════

class FaceProcessor:
    def __init__(self):
        self.face_detector = None
        self._init_detector()

    def _init_detector(self):
        """初始化人脸检测（用OpenCV DNN，轻量快速）"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), "models",
                                      "face_detection_yunet_2023mar.onnx")
            if os.path.exists(model_path):
                self.face_detector = cv2.FaceDetectorYN.create(
                    model_path, "", (320, 320),
                    score_threshold=0.5, nms_threshold=0.3)
                print("[人脸] YuNet 检测器就绪")
                return
        except Exception:
            pass

        # 后备：用 facexlib
        print("[人脸] 使用 facexlib 检测器")
        try:
            from facexlib.detection import init_detection_model
            self.facedet = init_detection_model("retinaface_resnet50")
            self.det_type = "facexlib"
            return
        except Exception:
            pass
        print("[人脸] 未加载专用检测器（使用OpenCV Haar级联）")

    def detect(self, img):
        """返回人脸框列表 [(x,y,w,h,conf), ...]"""
        h, w = img.shape[:2]
        faces = []

        # YuNet
        if self.face_detector is not None:
            self.face_detector.setInputSize((w, h))
            _, results = self.face_detector.detect(img)
            if results is not None:
                for r in results:
                    x, y, fw, fh = map(int, r[:4])
                    faces.append((x, y, fw, fh, r[-1]))
            return faces

        # facexlib
        if hasattr(self, 'det_type') and self.det_type == "facexlib":
            try:
                from facexlib.utils import face_restoration_helper
                bboxes = self.facedet.detect_faces(
                    cv2.cvtColor(img, cv2.COLOR_BGR2RGB), 0.5)
                if bboxes is not None and len(bboxes) > 0:
                    for b in bboxes:
                        x1, y1, x2, y2, conf = b[:5]
                        faces.append((int(x1), int(y1), int(x2-x1), int(y2-y1), conf))
            except Exception:
                pass
            return faces

        # OpenCV Haar 后备
        try:
            haar = cv2.CascadeClassifier(
                cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            rects = haar.detectMultiScale(gray, scaleFactor=1.1, minSize=(30, 30))
            for (x, y, fw, fh) in rects:
                faces.append((x, y, fw, fh, 0.9))
        except Exception:
            pass
        return faces

    def enhance(self, img, gfpgan_model=None):
        """人脸检测 + 增强"""
        faces = self.detect(img)
        if not faces:
            print("[人脸] 未检测到人脸")
            return img

        print(f"[人脸] 检测到 {len(faces)} 张人脸")

        # 如果有 GFP-GAN，用它做整图增强（它自带检测）
        if gfpgan_model is not None:
            try:
                rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                _, _, output = gfpgan_model.enhance(
                    rgb, has_aligned=False, only_center_face=False,
                    paste_back=True, weight=0.5)
                return cv2.cvtColor(output, cv2.COLOR_RGB2BGR)
            except Exception as e:
                print(f"[人脸] GFP-GAN 失败: {e}，使用逐脸传统增强")

        # 传统增强兜底
        result = img.copy()
        for i, (x, y, fw, fh, conf) in enumerate(faces):
            margin = int(min(fw, fh) * 0.2)
            x1 = max(0, x - margin)
            y1 = max(0, y - margin)
            x2 = min(img.shape[1], x + fw + margin)
            y2 = min(img.shape[0], y + fh + margin)

            face_crop = img[y1:y2, x1:x2]
            enhanced = auto_white_balance(face_crop)
            enhanced = unsharp(enhanced, 0.3)

            # 羽化融合
            mask = np.ones((y2-y1, x2-x1), dtype=np.float32)
            ks = min(20, (y2-y1)//5, (x2-x1)//5) * 2 + 1
            if ks > 1:
                mask = cv2.GaussianBlur(mask, (ks, ks), 0)
            for c in range(3):
                result[y1:y2, x1:x2, c] = (enhanced[:, :, c] * mask +
                                           result[y1:y2, x1:x2, c] * (1 - mask))
            print(f"  [人脸{i+1}] {fw}*{fh} conf={conf:.2f}")

        return result


# ═══════════════════════════════════════════════════════════════
# 5. 主管线
# ═══════════════════════════════════════════════════════════════

class RestorationPipeline:
    VERSION = "2.0.0"

    def __init__(self):
        self.models = AIModels()
        self.face_proc = FaceProcessor()
        self.stats = []

    def log_step(self, name, t0):
        t = time.time() - t0
        self.stats.append((name, round(t, 2)))
        print(f"  [{name}] {t:.1f}s")

    def restore(self, input_path, output_path, mode="auto"):
        """
        mode:
          auto  - 自动分析损伤，智能走管线
          full  - 全力修复：颜色+划痕+人脸+超分
          quick - 快速模式：只做颜色校正+人脸
        """
        print(f"\n{'='*50}")
        print(f"  孝心帮老照片修复引擎 v{self.VERSION}")
        print(f"{'='*50}")
        basename = os.path.basename(input_path)
        print(f"  输入: {basename}")
        print(f"  模式: {mode.upper()}")
        print(f"{'='*50}\n")

        start = time.time()
        self.stats = []

        # ── 加载 ──
        t0 = time.time()
        img = cv2.imread(input_path)
        if img is None:
            pil_img = Image.open(input_path).convert("RGB")
            img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        if img is None:
            raise ValueError(f"无法读取: {input_path}")
        h, w = img.shape[:2]
        print(f"[1] 加载: {w}*{h}")
        self.log_step("加载", t0)

        # ── 损伤分析 ──
        t0 = time.time()
        damage = analyze_damage(img)
        self.log_step("分析", t0)
        severity = damage["severity"]

        result = img.copy()
        loaded_models = {}

        # 严重先缩图加速AI
        if severity > 0.3 and max(w, h) > 1200:
            result = smart_resize(result)

        # ── 色彩校正（所有照片必做） ──
        t0 = time.time()
        print("[2] 色彩校正...")
        result = auto_white_balance(result)
        result = clahe_enhance(result)
        result = adjust_saturation(result, 1.2)
        if damage["needs_denoise"]:
            result = denoise(result)
        result = unsharp(result, 0.3)
        self.log_step("色彩校正", t0)

        # ── 划痕/破损修补 ──
        if mode == "full" or (mode == "auto" and damage["needs_inpaint"]):
            t0 = time.time()
            print("[3] 划痕修补...")
            result = inpaint_scratch(result)
            self.log_step("划痕修补", t0)

        # ── GFP-GAN 人脸增强 ──
        if mode == "full" or (mode == "auto" and severity > 0.15):
            t0 = time.time()
            print("[4] 人脸增强...")
            gfpgan = self.models.get_gfpgan()
            if gfpgan is not None:
                loaded_models["gfpgan"] = True
            result = self.face_proc.enhance(result, gfpgan)
            self.log_step("人脸增强", t0)

        # ── Real-ESRGAN 超分 ──
        if mode == "full" or (mode == "auto" and damage["needs_sr"]):
            t0 = time.time()
            print("[5] AI超分...")
            esrgan = self.models.get_realesrgan()
            if esrgan is not None:
                try:
                    rgb = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
                    output, _ = esrgan.enhance(rgb, outscale=2)
                    result = cv2.cvtColor(output, cv2.COLOR_RGB2BGR)
                    print(f"     超分: {w}*{h} -> {result.shape[1]}*{result.shape[0]}")
                except Exception as e:
                    print(f"     超分跳过: {e}")
            self.log_step("AI超分", t0)

        # ── 最终抛光 ──
        t0 = time.time()
        print("[6] 最终抛光...")
        result = adjust_brightness(result, 1.03, 3)
        result = unsharp(result, 0.2)
        self.log_step("最终抛光", t0)

        # ── 保存 ──
        cv2.imwrite(output_path, result)

        total = time.time() - start
        print(f"\n{'='*50}")
        print(f"  修复完成! 耗时 {total:.1f}s")
        for name, t in self.stats:
            print(f"    {name}: {t:.1f}s")
        print(f"  输出: {output_path}")
        print(f"{'='*50}\n")

        return {
            "output": output_path,
            "time": round(total, 1),
            "steps": self.stats,
            "models": list(loaded_models.keys()),
        }


# ═══════════════════════════════════════════════════════════════
# 命令行
# ═══════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="孝心帮老照片修复引擎")
    parser.add_argument("-i", "--input", required=True, help="输入图片路径")
    parser.add_argument("-o", "--output", default=None, help="输出路径")
    parser.add_argument("-m", "--mode", choices=["auto", "full", "quick"],
                       default="auto", help="修复模式")
    parser.add_argument("--json", action="store_true", help="JSON 输出（给 API 调用）")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(json.dumps({"error": f"文件不存在: {args.input}"}))
        sys.exit(1)

    output = args.output
    if output is None:
        p = Path(args.input)
        output = str(p.parent / f"{p.stem}_已修复{p.suffix}")

    pipeline = RestorationPipeline()
    try:
        result = pipeline.restore(args.input, output, mode=args.mode)
        if args.json:
            print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
