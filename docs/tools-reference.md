# 智能体工具参考手册

## 1. Karpathy Skills

**GitHub**: https://github.com/karpathy/skills
**用途**: 通过 CLAUDE.md 为 AI 编程助手编写工作说明书
**特点**:
- 无需复杂配置
- 规则清晰即可让 AI 按指定方式编码
- 一天涨星 3300+，深受开发者认可

**在孝心帮的应用**:
- 为每个模块编写编码规范
- 定义 API 调用约定
- 制定前端/后端开发规则

## 2. CodeGraph

**GitHub**: https://github.com/codegraph-ai/codegraph
**用途**: 代码知识图谱构建
**特点**:
- 把整个项目整理成地图
- AI 无需逐行硬读代码
- 本地运行，节省 Token
- 当天涨星 2400+

**在孝心帮的应用**:
- 构建前端页面关系图
- 构建后端 API 调用链
- 识别循环依赖

## 3. html-video

**GitHub**: https://github.com/nexu-io/html-video
**本地路径**: `D:\xiaoxinbang\html-video`
**协议**: Apache-2.0
**用途**: 开源本地 HTML→MP4 视频生成工具，用 HTML+CSS 做教程视频

**核心特性**:
- 本地渲染（Headless Chromium + ffmpeg），不上传数据
- 21 个内置模板（讲解视频、产品展示、数据可视化等）
- AI Agent 驱动（可选 Claude/Cursor 等配合生成）
- 可插拔渲染引擎（Hyperframes / Remotion）

**在孝心帮的应用**:
- 语音挂号使用教程（30秒）
- 每日签到引导视频
- 老照片修复功能介绍
- 其他功能教程批量生成

**启动命令**:
```powershell
cd D:\xiaoxinbang\html-video
node packages/cli/dist/bin.js studio
# → http://127.0.0.1:3071
```

**前置依赖**:
- ffmpeg（手动安装）
- Google Chrome 或 Chromium（手动安装）

## 3. Understand Anything

**GitHub**: https://github.com/understand-anything/code-navigator
**用途**: 代码库导航仪
**特点**:
- 生成项目地图
- 展示调用关系和模块职责
- 支持 Claude Code、Codex 等 20+ 平台
- 累计 21000+ 星

**在孝心帮的应用**:
- 代码变更影响分析
- 函数调用链追踪
- 代码审查

## 4. Presenton

**GitHub**: https://github.com/presenton/presenton
**用途**: 开源版 Gamma，一句话生成 PPT
**特点**:
- 提供 API 可接入工作流
- 适合演示文档生成
- 支持自定义模板

**在孝心帮的应用**:
- 版本发布文档
- 项目周报
- 产品介绍 PPT

## 5. NVIDIA LongLive

**GitHub**: https://github.com/NVIDIA/LongLive
**用途**: 实时长视频生成
**特点**:
- NVFP4 量化
- 压缩、并行推理、质量平衡
- 适合视频生成工作流

**在孝心帮的应用**:
- 功能宣传视频
- 长辈使用教程
- 更新日志视频

## 6. Claude Plugins Official

**GitHub**: (Claude 官方插件生态)
**用途**: AI 插件生态系统
**特点**:
- 连续两天霸榜 GitHub
- 直接嵌入工作流
- 不只是回答问题

**在孝心帮的应用**:
- 代码审查插件
- 沙盒测试插件
- 部署门禁插件
## 7. IOPaint（本地老照片修复，优先推荐）

**GitHub**: https://github.com/Sanster/IOPaint
**用途**: 完全本地部署的老照片修复工具，支持破损修补(inpainting)、去划痕、上色、超分
**特点**:
- 完全免费开源，无需 API Key
- 支持 LaMa/MAT/Real-ESRGAN/GFPGAN/DeOldify 等多种模型
- 自带 Web UI + REST API，可被后端调用
- 支持 CPU/GPU，国内直连无网络问题

**在孝心帮的应用**:
- 老照片破损修补（划痕、裂纹、缺块）
- 黑白照片上色
- 老照片超分辨率
- 人脸修复增强

**后端集成代码**: `backend/utils/iopaintBridge.js`（已写，调用即用）
**管道集成**: `doubaoRestore.js` 已自动检测 IOPaint 服务，优先使用

**启动命令**（安装后）:
```bash
# 安装
pip install iopaint

# 启动 LaMa 修补模型（CPU，推荐）
iopaint start --model=lama --port=8080 --device=cpu

# 启动 Real-ESRGAN 超分模型
iopaint start --model=real-esrgan --port=8081 --device=cpu
```

## 8. Microsoft Bringing-Old-Photos-Back-to-Life（微软官方，最强效果）

**GitHub**: https://github.com/microsoft/Bringing-Old-Photos-Back-to-Life
**用途**: 老照片修复天花板，自动去划痕、去噪、人脸增强、黑白上色一条龙
**特点**:
- 微软开源，效果顶级
- 支持严重破损、泛黄、裂纹照片
- 有现成 Web UI / API
- 需要 GPU 加速最佳

**在孝心帮的应用**:
- 重度破损老照片修复
- 人脸模糊重建
- 批量修复

## 9. GFPGAN（腾讯 ARC Lab，人脸修复工业级）

**GitHub**: https://github.com/TencentARC/GFPGAN
**用途**: 人脸修复最强 GAN，模糊褪色遮挡人脸都能高清重建
**特点**:
- 保留身份特征
- 速度快、效果稳
- 可单独用，也可搭配上色/划痕模型

**在孝心帮的应用**:
- 老照片人脸模糊修复
- 五官看不清重建

## 10. LaMa（大区域破损修复）

**GitHub**: https://github.com/saic-mdal/lama
**用途**: 超大区域破损补全，裂纹、缺角、撕裂、水印去除
**特点**:
- 基于傅里叶卷积，分辨率鲁棒
- 严重破损老照片首选
- 已整合进 IOPaint（可通过 IOPaint 直接使用）

## 11. DeOldify / DDColor（黑白上色）

**GitHub**: 
- DeOldify: https://github.com/jantic/DeOldify
- DDColor: https://github.com/pku-vds/DDColor
**用途**: 黑白老照片自动上色
**特点**:
- DeOldify：上色鼻祖，色彩自然
- DDColor：2024 新模型，更真实无伪影
- 已整合进 IOPaint

## 选型建议

| 场景 | 推荐方案 | 部署难度 |
|:----|:---------|:--------:|
| 一键全搞定 | **IOPaint**（LaMa + GFPGAN + Real-ESRGAN） | ⭐（最简单）|
| 效果最好 | Microsoft Bring-Old-Photos-Back-to-Life | ⭐⭐⭐ |
| 人脸修复 | GFPGAN | ⭐⭐ |
| 纯前端/零服务器 | Inpaint-Web（WebGPU浏览器端） | ⭐（零部署）|

## 现有代码集成状态

| 文件 | 状态 | 说明 |
|:----|:----:|------|
| `backend/utils/iopaintBridge.js` | ✅ 已写好 | 调用本地 IOPaint 的 REST API |
| `backend/utils/replicateRestore.js` | ✅ 已写好 | 调用 Replicate API（需 Key）|
| `backend/utils/doubaoRestore.js` | ✅ 已集成 | IOPaint > 百度 > jimp 三级兜底 |
