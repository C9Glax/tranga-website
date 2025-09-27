# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY ./website /app
RUN npm install
RUN npm run generate

# Serve stage
FROM nginx:alpine3.17-slim

# Copy built files from Vite's dist folder
COPY --from=builder /app/.output/public /usr/share/nginx/html
#COPY --from=builder /app/tranga-website/media /usr/share/nginx/html/media
COPY ./nginx /etc/nginx

EXPOSE 80
ENV API_URL=http://tranga-api:6531
CMD ["nginx", "-g", "daemon off;"]