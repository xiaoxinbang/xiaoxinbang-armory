# 前端沙盒容器
FROM node:18-alpine

WORKDIR /app

# 先安装依赖（利用缓存）
COPY package*.json ./
RUN npm ci --only=production

# 开发模式用 volume 覆盖
EXPOSE 8080

CMD ["npm", "run", "dev", "--", "--port", "8080"]
