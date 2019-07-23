FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/common ./packages/common
COPY ./services/ideas ./services/ideas

COPY package.json ./

RUN yarn install

WORKDIR /usr/app/src/services/ideas
CMD yarn start:dev