FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/common ./packages/common
COPY ./services/gateway ./services/gateway

COPY package.json ./
COPY yarn.lock ./

RUN yarn install
RUN yarn global add nodemon

CMD nodemon ./services/gateway/dist/index.js