FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/common ./packages/common
COPY ./services/gateway ./services/gateway

COPY package.json ./

RUN yarn install

WORKDIR /usr/app/src/services/gateway
CMD yarn start:dev