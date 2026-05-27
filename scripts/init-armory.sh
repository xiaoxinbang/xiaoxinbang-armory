#!/bin/bash
# 兵器库初始化脚本
# 将兵器库的智能体配置注入到孝心帮项目

set -e

PROJECT_DIR=${1:-.}
ARMORY_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "============================================"
echo "  将兵器库智能体注入到项目中..."
echo "  项目路径: $PROJECT_DIR"
echo "  兵器库路径: $ARMORY_DIR"
echo "============================================"

# 1. 复制主 CLAUDE.md
echo "[1/3] 注入主规则..."
cp "$ARMORY_DIR/CLAUDE.md" "$PROJECT_DIR/CLAUDE.md"

# 2. 创建 skills 目录
echo "[2/3] 注入智能体技能..."
mkdir -p "$PROJECT_DIR/.claude/skills"
cp -r "$ARMORY_DIR/agents/"* "$PROJECT_DIR/.claude/skills/"

# 3. 注册工作流
echo "[3/3] 注册工作流..."
mkdir -p "$PROJECT_DIR/.claude/workflows"
cp -r "$ARMORY_DIR/workflows/"* "$PROJECT_DIR/.claude/workflows/"

echo ""
echo "注入完成！智能体团队已就绪。"
echo "运行: claude --skill list 查看可用智能体"
