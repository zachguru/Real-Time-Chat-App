# Stage 1: Build the Angular app
FROM node:14 as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build --prod

# Stage 2: Create a lightweight production image
FROM nginx:alpine

COPY --from=build-stage /app/dist/frontend /usr/share/nginx/html
