# 孝心帮全自动工作流 · 智能体兵器库

> Xiaoxinbang AI Agent Arsenal — 为孝心帮项目打造的**五帮五维全自动飞轮**智能体团队

[![GitHub stars](https://img.shields.io/github/stars/xiaoxinbang/xiaoxinbang-armory)](https://github.com/xiaoxinbang/xiaoxinbang-armory)

## 概览

本仓库是孝心帮项目的 **智能体兵器库**，以"五帮五维"全角色为核心，驱动 **引流→流入→留住→锁住→裂变** 的自动化飞轮效应。

## 五帮核心价值

| 角色 | 价值 | 飞轮 |
|------|------|------|
| **帮长辈** 🧓 | 老有所依、老有所为、老有所得 | 流入→留住→锁住 |
| **帮家属** 👨‍👩‍👧‍👦 | 远程尽孝、安心无忧、孝心常伴 | 留住→锁住→裂变 |
| **帮社区** 🏘️ | AI便民、暖心服务、共建美好家园 | 引流→留住→锁住 |
| **帮商家** 🏪 | 智能引流、轻松长效盈利 | 引流→锁住 |
| **帮创业** 🚀 | 孝心蓝海、零风险、轻松创业 | 引流→留住→锁住→裂变 |

> **平台理念**: 坚持全角色共赢、共创、共建、共享，孝心帮是所有人的幸福之家。

## 智能体阵容

| 智能体 | 角色 | 飞轮职责 |
|--------|------|---------|
| [CodeGraph](agents/codegraph/) | 📊 地图构建者 | 五帮知识图谱、飞轮覆盖矩阵 |
| [Understand Anything](agents/understand-anything/) | 🔍 断裂点侦探 | 飞轮断裂点检测、变更分析 |
| [Karpathy Skills](agents/karpathy-skills/) | 📜 规则制定者 | 积分/分润/触发规则 |
| [Claude Plugins](agents/claude-plugins/) | ⚡ 自动化引擎 | 飞轮触发插件、质量门禁 |
| [Presenton](agents/presenton/) | 📑 内容引擎 | 五帮文档/PPT自动生成 |
| [NVIDIA LongLive](agents/longlive/) | 🎬 视频引擎 | 五帮视频教程/宣传片 |

## 飞轮自动化闭环

```
                    ┌─────────────────────┐
                    │   1. 引流 (Attract) │
                    │   社区/商家/创业    │
                    └─────────┬───────────┘
                              │ 注册/扫码
                              ▼
                    ┌─────────────────────┐
                    │   2. 流入 (Inflow)  │
                    │   微信/语音/游客    │
                    └─────────┬───────────┘
                              │ 完成onboarding
                              ▼
          ┌─────── 3. 留住 (Retain)       │
          │      签到/积分/游戏/健康     │
          │      └─────────┬───────────┘
          │                │ 活跃达标
          │                ▼
          │      4. 锁住 (Lock-in)        │
          │      军衔/会员/商城/SOS       │
          │      └─────────┬───────────┘
          │                │ 分享冲动
          │                ▼
          │      5. 裂变 (Virality)       │
          │      邀请/分润/祝福/分享      │
          │      └─────────┬───────────┘
          └────────────────┘
                    回流新用户 → 回到阶段1
```

## 工作流

- [x] 五帮全角色地图 (47+页面全映射)
- [x] 飞轮覆盖审计脚本
- [x] 飞轮断裂点检测脚本
- [x] 飞轮E2E闭环测试
- [x] 每日飞轮审计工作流
- [x] 代码审查自动化
- [x] 前端构建部署
- [x] 后端 CI/CD
- [x] 沙盒测试环境
- [ ] 视频内容自动生产
- [ ] 全自动迭代闭环

## 快速开始

```bash
# 克隆兵器库
git clone https://github.com/xiaoxinbang/xiaoxinbang-armory.git
cd xiaoxinbang-armory

# 运行飞轮覆盖审计
node scripts/flywheel-audit.js

# 运行断裂点检测
node scripts/detect-gaps.js

# 启动沙盒测试环境
cd sandbox && docker-compose up

# 运行飞轮E2E测试
node sandbox/tests/e2e/flywheel-full-cycle.test.js
```

## 架构

```
兵器库
├── agents/          ← 6大智能体 (CLAUDE.md Skills)
│   ├── codegraph/          📊 地图构建者
│   ├── understand-anything/ 🔍 断裂点侦探
│   ├── karpathy-skills/    📜 规则制定者
│   ├── claude-plugins/     ⚡ 自动化引擎
│   ├── presenton/          📑 内容引擎
│   └── longlive/           🎬 视频引擎
├── workflows/       ← 工作流编排 (含飞轮)
├── sandbox/         ← 沙盒测试环境 + E2E测试
├── scripts/         ← 飞轮审计自动化脚本
└── docs/            ← 文档 (含五帮架构)
```
