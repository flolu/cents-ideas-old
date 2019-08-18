FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/utils ./packages/utils
COPY ./services/ideas ./services/ideas

WORKDIR /usr/app/src/services/ideas
CMD yarn start:dev