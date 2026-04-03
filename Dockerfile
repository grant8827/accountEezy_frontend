FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . ./
RUN npm run build -- --configuration production

FROM nginx:alpine AS runtime
COPY --from=build /app/dist/account-eezy-frontend/browser /usr/share/nginx/html

# SPA routing: redirect all 404s back to index.html
RUN printf 'server {\n  listen 8080;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
