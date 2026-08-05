# -------- Stage 1: Build Angular app --------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build-time variable (used by Angular at build time)
ARG NG_APP_API_URL
ENV NG_APP_API_URL=$NG_APP_API_URL

RUN npx ng build ecommerce_client --configuration production

# -------- Stage 2: Serve with Nginx --------
FROM nginx:alpine
COPY --from=build /app/dist/ecommerce_client/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
