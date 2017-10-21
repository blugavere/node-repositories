FROM node:argon

WORKDIR /app

ONBUILD ARG APP_VERSION
ONBUILD ENV APP_VERSION ${APP_VERSION}

COPY package.json /tmp/
RUN cd /tmp && npm install --prod \
  # no dependencies
  # && cp -a /tmp/node_modules /app \
  && npm cache clear

COPY . /app

ENV NODE_ENV=docker
ENV PORT=$PORT

CMD ["gulp"]
