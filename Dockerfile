# npm packages
FROM node:24-alpine AS builder

WORKDIR /app
COPY ./website/package.json /app

RUN npm update -g npm
RUN npm install

# Build stage
FROM node:24-alpine AS gen
WORKDIR /app

COPY --from=builder /app /app

COPY ./website /app
RUN npm run generate

# Serve stage
FROM nginx:alpine3.22-slim

# Copy built files from Vite's dist folder
COPY --from=gen /app/.output/public /usr/share/nginx/html
#COPY --from=builder /app/tranga-website/media /usr/share/nginx/html/media
COPY ./nginx /etc/nginx

EXPOSE 80
ENV API_URL=http://tranga-api:6531
CMD ["nginx", "-g", "daemon off;"]