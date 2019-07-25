FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/utils ./packages/utils
COPY ./services/ideas ./services/ideas

COPY package.json .
COPY ./docker-images/ideas/tsconfig.json ./
COPY ./tsconfig.settings.json ./

RUN yarn bootstrap

WORKDIR /usr/app/src/services/ideas
CMD yarn start