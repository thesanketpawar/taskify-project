FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 5000
CMD ["node","server.js"]
