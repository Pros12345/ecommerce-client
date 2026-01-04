# -------- Stage 1: Build Angular app --------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx ng build ecommerce_client --configuration production

# -------- Stage 2: Serve with Nginx --------
FROM nginx:alpine
COPY --from=build /app/dist/ecommerce_client/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
