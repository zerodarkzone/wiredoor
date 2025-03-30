FROM node:20-alpine3.21 AS base

WORKDIR /app

ENV TZ=America/New_York

RUN apk add --update \
  dpkg iptables gawk tzdata \
  wireguard-tools tcpdump nginx nginx-mod-stream supervisor openssl certbot

COPY resources/crontabs /etc/crontabs/
COPY resources/nginx /etc/nginx/
COPY resources/openssl /etc/openssl/
COPY resources/supervisor /etc/supervisor/

RUN mkdir -p /var/log/supervisor \
  && mkdir -p /var/www/letsencrypt \
  && rm -f /etc/nginx/conf.d/stream.conf \
  && touch /var/log/supervisor/app.stdout.log \
  && ln -sf /dev/stdout /var/log/supervisor/app.stdout.log \
  && touch /var/log/supervisor/app.stderr.log \
  && ln -sf /dev/stderr /var/log/supervisor/app.stderr.log

FROM base AS dev-container

RUN apk add --update git nano curl

FROM base AS development

COPY --chown=node:node package*.json .

COPY --chown=node:node api/package*.json api/

COPY --chown=node:node ui/package*.json ui/

RUN npm i --recursive

COPY --chown=node:node . .

FROM base AS build

COPY --chown=node:node api/package*.json ./

COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node api/. .

RUN npm run build

RUN npm ci --omit=dev && npm cache clean --force

FROM node:20-alpine3.21 AS uibuild

WORKDIR /app

COPY --chown=node:node ui/package*.json ./

RUN npm i

COPY --chown=node:node ui/. .

RUN npm run build

FROM base AS production

# ENV DEBUG=*

COPY --chown=node:node --from=build /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/dist /app/dist
COPY --chown=node:node --from=uibuild /app/dist /app/dist/public

VOLUME ["/etc/letsencrypt","/data"]

CMD [ "sh", "-c", "env > /etc/environment && exec /usr/bin/supervisord -ns -c /etc/supervisor/supervisord.conf" ]

# USER node
