# Presenton — 演示文档自动生成师

> 职责：一句话生成专业 PPT，支持 API 接入自动化工作流

## 核心能力

- 从 Markdown 生成专业 PPT
- 支持自定义模板和品牌色
- 提供 API 接口，可嵌入 CI/CD 流水线
- 支持导出 HTML/PDF/PPTX

## 工作方式

### 1. 内容生成模式

```bash
# 从 Markdown 生成
presenton build --input docs/release-notes.md --output releases/v2.0.pptx

# 从一句话生成
presenton generate "孝心帮V2.0版本发布说明" --template product-launch
```

### 2. 模板系统

预置模板：
- `product-launch` — 产品发布
- `weekly-report` — 周报
- `tech-design` — 技术方案
- `api-docs` — API 文档

### 3. 自动化集成

在 CI/CD 中:
```yaml
generate-ppt:
  script:
    - presenton generate "孝心帮$(date +%Y-%m-%d)发布说明"
    - presenton export --format pdf
    - upload artifacts/
```

## 孝心帮专用文档模板

- 产品更新日志
- 版本发布说明
- 项目周报
- API 变更文档
- 测试报告
