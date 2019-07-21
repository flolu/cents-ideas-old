FROM node:lts-alpine

WORKDIR /usr/app/src

# packages
COPY ./packages/common/src ./packages/common/src
COPY ./packages/common/package.json ./packages/common/.
COPY ./packages/common/tsconfig.json ./packages/common/.

# service
COPY ./services/gateway/src ./services/gateway/src
COPY ./services/gateway/package.json ./services/gateway/.
COPY ./services/gateway/tsconfig.json ./services/gateway/.

# monorepo
COPY package.json .
COPY ./tsconfig.json ./
COPY ./tsconfig.settings.json ./

RUN yarn bootstrap

CMD node ./services/gateway/dist/index.js