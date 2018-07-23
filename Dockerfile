FROM node:8.9.4-alpine

LABEL image=codejamninja/alexa-my-info \
      maintainer="Jam Risser <jam@codejam.ninja> (https://codejam.ninja)" \
      base=alpine:3.6

RUN apk add --no-cache \
    tini
RUN apk add --no-cache --virtual build-deps \
    build-base \
    git

WORKDIR /tmp/app

COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build && \
    mv /tmp/app /opt/app && \
    rm -rf /tmp/app && \
    apk del build-deps

WORKDIR /opt/app

EXPOSE 3000

ENV NODE_ENV=production

ENTRYPOINT ["/sbin/tini", "--", "node", "/opt/app/dist/server.js"]
