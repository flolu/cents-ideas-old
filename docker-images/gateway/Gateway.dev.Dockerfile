FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/common ./packages/common
COPY ./services/gateway ./services/gateway

WORKDIR /usr/app/src/services/gateway
CMD yarn start:dev