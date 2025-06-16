FROM node:20-bookworm AS base

WORKDIR /app

ARG VERSION=1.0.0

ENV TZ=America/New_York

RUN curl -s https://install.crowdsec.net | sh
# Use apt-get instead of apk, update package list, install packages, then clean up
RUN apt-get update && apt-get install -y --no-install-recommends \
  iptables gawk dpkg tzdata \
  wireguard-tools tcpdump nginx libnginx-mod-stream supervisor openssl certbot cron curl bash \
  iputils-ping lua5.1 libnginx-mod-http-lua luarocks gettext-base lua-cjson crowdsec-nginx-bouncer \
  && rm -rf /var/lib/apt/lists/*

# Nginx "stream" module config might be in /etc/nginx/modules-enabled or similar, adjust if needed

COPY docker/resources/crontabs /etc/cron.d/
COPY docker/resources/crowdsec /etc/crowdsec/
COPY docker/resources/nginx /etc/nginx/
COPY docker/resources/openssl /etc/ssl/
COPY docker/resources/supervisor /etc/supervisor/

RUN mkdir -p /var/log/supervisor \
  && mkdir -p /var/www/letsencrypt \
  && mkdir -p /data \
  && mkdir -p /run/nginx \
  && rm -f /etc/nginx/conf.d/stream.conf \
  && touch /var/log/supervisor/app.stdout.log \
  && ln -sf /dev/stdout /var/log/supervisor/app.stdout.log \
  && touch /var/log/supervisor/app.stderr.log \
  && ln -sf /dev/stderr /var/log/supervisor/app.stderr.log \
  && chmod 0644 /etc/cron.d/* \
  && crontab /etc/cron.d/crontabs || true

FROM base AS dev-container

# Install extra dev tools
RUN apt-get update && apt-get install -y --no-install-recommends \
  git rsync nano curl bash sqlite3 \
  && rm -f /etc/supervisor/conf.d/app.conf \
  && rm -rf /var/lib/apt/lists/*

CMD [ "bash", "-c", "/usr/bin/supervisord -ns -c /etc/supervisor/supervisord.conf" ]

FROM base AS development

COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .

FROM base AS build

ARG OAUTH2PROXY_VERSION="7.9.0"

# Install curl if missing, which we already included in base now, but keeping here in case
RUN apt-get update && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/* \
  && curl -sL https://github.com/oauth2-proxy/oauth2-proxy/releases/download/v${OAUTH2PROXY_VERSION}/oauth2-proxy-v${OAUTH2PROXY_VERSION}.linux-amd64.tar.gz -o /tmp/oauth2-proxy.tar.gz \
  && tar -xzf /tmp/oauth2-proxy.tar.gz \
  && mv ./oauth2-proxy-v${OAUTH2PROXY_VERSION}.linux-amd64/oauth2-proxy /usr/bin/oauth2-proxy

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

RUN npm ci --omit=dev && npm cache clean --force

FROM node:20-bookworm AS uibuild

WORKDIR /app

COPY --chown=node:node frontend/package*.json ./

RUN npm install

COPY --chown=node:node frontend/. .

RUN npm run build

FROM base AS production

ENV NODE_ENV=production

LABEL org.opencontainers.image.licenses=MIT \
      org.opencontainers.image.description="Self hosted ingress-as-a-service platform that allows you to expose applications and services running in private or local networks to the internet" \
      org.opencontainers.image.documentation=https://www.wiredoor.net/docs \
      org.opencontainers.image.source=https://github.com/wiredoor/wiredoor \
      org.opencontainers.image.url=https://ghcr.io/wiredoor/wiredoor \
      org.opencontainers.image.title=wiredoor \
      org.opencontainers.image.version=${VERSION}

COPY --from=build /usr/bin/oauth2-proxy /usr/bin/oauth2-proxy
COPY --chown=node:node --from=build /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/dist /app/dist
COPY --chown=node:node --from=uibuild /app/dist /app/dist/public
COPY --chown=node:node docker/resources/init.sh /init.sh

RUN chmod +x /init.sh

VOLUME ["/etc/letsencrypt","/data"]

CMD [ "/init.sh" ]

# USER node
