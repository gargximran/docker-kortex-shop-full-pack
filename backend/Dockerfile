FROM node:16.13.1-alpine3.14

COPY . /opt/backend/

EXPOSE 5000

WORKDIR /opt/backend/

RUN yarn install --frozen-lockfile


ENTRYPOINT ["yarn", "start"]
