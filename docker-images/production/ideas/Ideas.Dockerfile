FROM node:lts-alpine

WORKDIR /usr/app/src

COPY ./packages/utils ./packages/utils
COPY ./packages/types ./packages/types
COPY ./packages/enums ./packages/enums

COPY ./services/ideas ./services/ideas

COPY package.json .
COPY ./docker-images/production/ideas/tsconfig.json ./
COPY ./tsconfig.settings.json ./

RUN yarn bootstrap

WORKDIR /usr/app/src/services/ideas
CMD yarn start