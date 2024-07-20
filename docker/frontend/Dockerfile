FROM node:21.5.0-alpine

WORKDIR /app

COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./

ARG VITE_APP_WALLET_CONNECT_PROJECT_ID
ARG VITE_APP_API_URL
ARG VITE_APP_GRAPHQL_URL

RUN npm ci --legacy-peer-deps
COPY ./frontend ./

CMD npm run dev