FROM nginx:alpine3.17-slim
COPY ./Website /usr/share/nginx/html
EXPOSE 80
ENV API_URL=http://tranga-api:6531
CMD ["nginx", "-g", "daemon off;"]
