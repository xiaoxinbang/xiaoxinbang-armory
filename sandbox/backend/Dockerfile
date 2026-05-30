# 后端沙盒容器
FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "server.js"]
