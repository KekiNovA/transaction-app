FROM node:21.5.0-alpine

WORKDIR /app

COPY ./backend/package.json ./
COPY ./backend/package-lock.json ./

RUN npm ci
COPY ./backend ./

CMD npm run dev