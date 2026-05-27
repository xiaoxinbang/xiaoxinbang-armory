# 孝心帮全自动工作流 · 智能体兵器库

> Xiaoxinbang AI Agent Arsenal — 为孝心帮项目打造的前后端全自动工作流智能体团队

[![GitHub stars](https://img.shields.io/github/stars/xiaoxinbang/xiaoxinbang-armory)](https://github.com/xiaoxinbang/xiaoxinbang-armory)

## 概览

本仓库是孝心帮项目的 **智能体兵器库**，集结了 6 大 AI 智能体工具，覆盖**编程辅助、代码理解、文档生成、视频生成、插件生态**全链路。

## 智能体阵容

| 智能体 | 领域 | 职责 |
|--------|------|------|
| [Karpathy Skills](agents/karpathy-skills/) | 编程技能 | 通过 CLAUDE.md 定义 AI 工作方式 |
| [CodeGraph](agents/codegraph/) | 代码图谱 | 构建项目知识图谱，加速代码理解 |
| [Understand Anything](agents/understand-anything/) | 代码导航 | 分析调用关系、模块职责 |
| [Presenton](agents/presenton/) | PPT 生成 | 一句话生成专业演示文档 |
| [NVIDIA LongLive](agents/longlive/) | 视频生成 | 实时长视频生成 |
| [Claude Plugins](agents/claude-plugins/) | 插件生态 | 嵌入工作流的 AI 插件体系 |

## 工作流

- [x] 代码审查自动化
- [x] 前端构建部署
- [x] 后端 CI/CD
- [x] 文档/PPT 自动生成
- [x] 沙盒测试验证
- [ ] 视频内容自动生产
- [ ] 全自动迭代闭环

## 快速开始

```bash
# 克隆兵器库
git clone https://github.com/xiaoxinbang/xiaoxinbang-armory.git
cd xiaoxinbang-armory

# 查看工作流说明
cat workflows/full-automation.yml

# 启动沙盒测试环境
cd sandbox && docker-compose up
```

## 架构

```
兵器库
├── agents/          ← 智能体定义 (CLAUDE.md Skills)
├── workflows/       ← 工作流编排
├── sandbox/         ← 沙盒测试环境
├── scripts/         ← 自动化脚本
└── docs/            ← 文档
```
