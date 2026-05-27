# 孝心帮全自动工作流使用指南

## 快速上手

### 1. 注入智能体到项目

```bash
# 在孝心帮项目根目录执行
cd /path/to/xiaoxinbang
bash armory/scripts/init-armory.sh .
```

### 2. 启动全自动工作流

```bash
# 标准模式（自动分析变更 → 测试 → 审查）
bash armory/scripts/run-workflow.sh full-automation
```

### 3. 单独运行某个智能体

```bash
# 构建代码知识图谱
claude --skill codegraph "扫描孝心帮项目结构"

# 分析代码变更
claude --skill understand-anything "分析最近的git变更"

# 生成PPT文档
claude --skill presenton "生成孝心帮周报PPT"

# 编写工作规则
claude --skill karpathy-skills "为支付模块编写编码规范"
```

## 场景示例

### 场景1: 日常开发迭代

```bash
# 1. 拉取最新代码
git pull

# 2. 运行全自动工作流
bash armory/scripts/run-workflow.sh

# 3. 工作流自动执行:
#    - 分析本次变更
#    - 在沙盒构建测试
#    - 审查代码质量
#    - 生成变更报告
```

### 场景2: 版本发布

```bash
# 1. 沙盒全量回归测试
cd sandbox && docker-compose up -d && npm test

# 2. 生成发布文档
claude --skill presenton "生成v2.0版本发布说明"

# 3. (可选) 生成视频介绍
claude --skill longlive "生成新功能介绍视频"

# 4. 部署上线
git tag v2.0 && git push origin v2.0
```

## 智能体命令速查

| 智能体 | 示例命令 |
|--------|----------|
| Karpathy Skills | `claude --skill karpathy-skills "为XX模块写编码规范"` |
| CodeGraph | `claude --skill codegraph "扫描项目依赖关系"` |
| Understand Anything | `claude --skill understand-anything "分析XX变更影响"` |
| Presenton | `claude --skill presenton "生成XX文档"` |
| LongLive | `claude --skill longlive "生成XX视频"` |
| Claude Plugins | `claude --skill claude-plugins "注册XX插件"` |

## 沙盒测试

- 沙盒环境通过 Docker Compose 管理
- 使用独立端口避免影响本地开发
- 测试通过后方可部署到生产环境
- 详见 `sandbox/` 目录
