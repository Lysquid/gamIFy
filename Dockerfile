# syntax=docker/dockerfile:1

FROM node:21.4.0-alpine3.19 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm ci --omit=dev

FROM node:16.19.0-alpine3.16
USER node:node
WORKDIR /app
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json .
ARG HOST=127.0.0.1
ARG PORT=5050
ARG ORIGIN=http://127.0.0.1:5050
CMD ["node","build"]
