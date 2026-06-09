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
