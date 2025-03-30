# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build

# Serve stage
FROM nginx:alpine3.17-slim

# Copy built files from Vite's dist folder
COPY --from=builder /app/Website/dist /usr/share/nginx/html
COPY --from=builder /app/Website/media /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]