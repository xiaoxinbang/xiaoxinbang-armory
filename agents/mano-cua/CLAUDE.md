# Mano-CUA — GUI视觉自动化智能体

> 开源GUI-VLA智能体，纯视觉驱动，桌面软件/网页GUI自动化执行能力
> 来源：[Mininglamp-AI/mano-skill](https://github.com/Mininglamp-AI/mano-skill)
> 兵器库引用：`skills/mano-cua` (Git Submodule)

## 角色定位

🖐️ **视觉手脚** — 用mano-cua连接Mano-P（明略科技开源GUI-VLA模型），做龙虾和Claude Code共用的纯视觉GUI自动化层。

## 能力

- **纯视觉驱动**：不依赖DOM、Accessibility API、脚本注入，截图即理解
- **跨平台GUI操作**：点击、输入、滚动、拖拽等桌面操作
- **复杂长任务**：支持多步骤GUI任务规划与执行
- **云模式/本地模式**：macOS支持本地推理（Apple Silicon），其他平台走[mano.mininglamp.com](https://mano.mininglamp.com)云推理
- **数据隐私**：本地模式截图不出设备

## 安装方式

### 方式一：CLI工具

```bash
# macOS/Linux (Homebrew)
brew install Mininglamp-AI/tap/mano-cua

# Windows 手动安装
# 从 GitHub Releases 下载 windows.zip，解压后加入 PATH
# https://github.com/Mininglamp-AI/mano-skill/releases
```

### 方式二：ClawHub Skill

```bash
clawhub install mano-cua
```

### 基础使用

```bash
# 运行GUI任务
mano-cua run "打开微信并发送消息"

# 打开特定应用后执行
mano-cua run "在Notes中新建笔记" --app "Notes"

# 打开URL后执行
mano-cua run "搜索AI新闻并展示第一条" --url "https://www.google.com"

# 停止当前任务
mano-cua stop
```

## 使用场景（孝心帮）

- 桌面微信自动操作（发消息、建群、转发）
- 抖音/剪映后台自动化操作
- 宝塔面板/小程序后台GUI操作
- 浏览器端全自动化操作（小红书、百度等）
- 任何无API的桌面软件操作

## 系统权限

需在系统偏好设置中开启：
- ✅ 屏幕录制权限
- ✅ 辅助功能权限（键盘/鼠标控制）
