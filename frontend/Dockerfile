FROM node:latest

WORKDIR /app/frontend

COPY package*.json .

RUN npm install -g pnpm

RUN pnpm install

COPY . .