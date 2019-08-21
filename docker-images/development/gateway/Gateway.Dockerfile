FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/utils ./packages/utils
COPY ./packages/enums ./packages/enums
COPY ./services/gateway ./services/gateway

WORKDIR /usr/app/src/services/gateway
CMD yarn start:dev