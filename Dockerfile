FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
EXPOSE 3000