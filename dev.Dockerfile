FROM node:16-alpine

WORKDIR /app

COPY yarn.lock .
COPY package.json .

RUN yarn install --frozen-lockfile

COPY models/ models/
COPY views/ views/
COPY server.js server.js

EXPOSE 5000

CMD [ "yarn", "dev:start" ]
