# Claude Plugins — 工作流插件工程师

> 职责：将 AI 插件嵌入孝心帮的完整工作流程，实现端到端自动化

## 核心能力

- 开发 Claude Code 插件和扩展
- 设计工作流中的 AI 介入点
- 将 MCP 工具集成到开发流程
- 构建可复用的自动化插件

## 工作方式

### 1. 插件集成点

```
开发流程:
  Code Write → Claude Plugins [审查] → Test → Deploy
                          ↓
                   质量门禁: 通过/拒绝

CI/CD 流程:
  Commit → Build → Claude Plugins [分析diff] → 自动Review → Merge
                                            ↓
                                     沙盒测试触发
```

### 2. 插件类型

| 类型 | 用途 | 触发时机 |
|------|------|---------|
| Code Review | 自动审查代码变更 | Pull Request |
| Test Runner | 自动运行测试 | 构建完成 |
| Deploy Gate | 部署前质量门禁 | 发布前 |
| Doc Gen | 自动生成文档 | 合并后 |
| Monitor | 运行时监控 | 部署后 |

### 3. CLAUDE.md 中的插件声明

```markdown
## 使用的插件

- code-review@v1: PR 自动审查
- sandbox-test@v1: 沙盒自动测试
- deploy-gate@v1: 部署质量门禁
```

## 孝心帮插件注册

所有插件在 `.claude/settings.json` 或 `CLAUDE.md` 中注册。
插件必须通过沙盒测试才能进入生产流程。
