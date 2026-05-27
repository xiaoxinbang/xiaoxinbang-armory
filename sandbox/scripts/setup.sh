#!/bin/bash
# 沙盒环境一键初始化脚本
# 在孝心帮项目根目录执行

set -e

echo "============================================"
echo "  孝心帮沙盒测试环境 - 初始化"
echo "============================================"

# 1. 复制项目文件到沙盒
echo "[1/5] 复制前端文件..."
cp -r src/ sandbox/frontend/
cp package.json sandbox/frontend/
cp pages.json sandbox/frontend/

echo "[2/5] 复制后端文件..."
cp -r backend/ sandbox/backend/

echo "[3/5] 复制环境配置..."
cp .env.development sandbox/frontend/.env
cp backend/.env sandbox/backend/.env

# 2. 启动 Docker 沙盒
echo "[4/5] 启动 Docker 沙盒..."
docker-compose -f sandbox/docker-compose.yml up -d

# 3. 等待服务就绪
echo "[5/5] 等待服务就绪..."
sleep 5

# 健康检查
echo ""
echo "============================================"
echo "  沙盒状态检查"
echo "============================================"
curl -s http://localhost:3001/api/health || echo "后端启动中..."
curl -s http://localhost:8081 || echo "前端启动中..."

echo ""
echo "沙盒环境启动完成！"
echo "  前端: http://localhost:8081"
echo "  后端: http://localhost:3001"
echo "  MongoDB: mongodb://localhost:27018"
echo ""
echo "运行测试: docker-compose -f sandbox/docker-compose.yml run test-runner"
