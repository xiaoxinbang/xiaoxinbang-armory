# 🖼️ 孝心帮 · 老照片修复引擎

> 取各家开源之长，做不输付费的效果。
> 全部免费、本地运行、诚实透明。

---

## 效果对比

| 修复前 | 修复后 |
|--------|--------|
| 模糊、褪色、划痕、破损 | 高清、色彩还原、人脸清晰 |

## 技术架构

```
输入照片 → 智能损伤分析 → 色彩校正 → 划痕修补
        → GFP-GAN人脸增强 → Real-ESRGAN超分 → 最终输出
```

## 使用方式

### 方式1：拖拽修复（最简单）
把 `老照片修复工具.bat` 放到桌面，直接把老照片拖上去即可。

### 方式2：命令行
```bash
python photo_restoration_agent.py -i 老照片.jpg -o 修复结果.jpg
```

### 方式3：API调用
```json
POST /api/photo/restore
{ "image": "base64...", "engine": "local" }
```

## 三种修复模式

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| `auto` | 智能分析，自动选择管线 | 推荐，大部分照片适用 |
| `full` | 全力修复（颜色+划痕+人脸+超分） | 严重损坏的老照片 |
| `quick` | 快速模式（仅校色+人脸） | 轻度褪色照片 |

## 技术栈

| 组件 | 用途 | 来源 | 许可 |
|------|------|------|------|
| GFP-GAN v1.4 | 人脸修复 | TencentARC | Apache 2.0 |
| Real-ESRGAN | 超分增强 | xinntao | BSD 3-Clause |
| YuNet | 人脸检测 | OpenCV Zoo | Apache 2.0 |
| OpenCV | 传统CV处理 | 开源 | Apache 2.0 |

## 模型下载

首次运行会自动下载模型（约 500MB）。也可以手动运行下载器：
```bash
python download_models.py
```

## 文件结构

```
photo-restoration/
├── photo_restoration_agent.py   # 主引擎
├── 老照片修复工具.bat            # Windows拖拽工具
├── 老照片修复系统架构.md          # 详细架构文档
├── models/                      # 模型文件（自动下载）
│   └── face_detection_yunet_2023mar.onnx
└── README.md                    # 本文件
```

## 原理说明

我们的核心策略是"**Pipeline组合优于单模型**"：
- 每个模型只做自己最擅长的事
- 通过智能损伤分析判断走哪条管线
- 最终融合输出，效果 1+1 > 2

这也是 Remini、你我当年等付费 App 背后的核心逻辑。
