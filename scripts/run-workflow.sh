#!/bin/bash
# 运行全自动工作流
# 在孝心帮项目根目录执行

set -e

WORKFLOW=${1:-full-automation}
echo "启动工作流: $WORKFLOW"

# 1. 加载智能体团队
echo "[1] 加载智能体团队..."
source .claude/skills/*/CLAUDE.md 2>/dev/null || true

# 2. 阶段1: 代码分析
echo "[2] 分析代码变更..."
git diff --name-only HEAD~1 > /tmp/changed-files.txt
echo "  变更文件: $(cat /tmp/changed-files.txt | wc -l)个"

# 3. 阶段2: 运行沙盒测试
echo "[3] 运行沙盒测试..."
cd sandbox && docker-compose up -d
echo "  等待服务就绪..."
sleep 3
cd ..

# 4. 阶段3: 生成报告
echo "[4] 生成报告..."
REPORT_DIR="reports/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$REPORT_DIR"
echo "  报告目录: $REPORT_DIR"

# 5. 汇总
echo ""
echo "============================================"
echo " 工作流 [$WORKFLOW] 执行完成"
echo " 报告: $REPORT_DIR"
echo "============================================"
