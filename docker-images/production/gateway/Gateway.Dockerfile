FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/utils ./packages/utils
COPY ./packages/types ./packages/types
COPY ./packages/utils ./packages/enums
COPY ./services/gateway ./services/gateway

COPY package.json .
COPY ./docker-images/production/gateway/tsconfig.json ./
COPY ./tsconfig.settings.json ./

RUN yarn bootstrap

WORKDIR /usr/app/src/services/gateway
CMD yarn start