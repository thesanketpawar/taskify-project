# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage with Nginx
FROM nginx:alpine
# Built JS/HTML files copy
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx Custom Config copy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
