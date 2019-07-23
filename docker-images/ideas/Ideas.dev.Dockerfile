FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/common ./packages/common
COPY ./services/ideas ./services/ideas

WORKDIR /usr/app/src/services/ideas
CMD yarn start:dev