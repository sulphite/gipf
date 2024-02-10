FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm install -g pnpm

RUN pnpm install --no-frozen-lockfile

COPY . /app/

EXPOSE 5173