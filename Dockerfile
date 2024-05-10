FROM alpine:3.18
LABEL maintainer="Rishi Ghan <rishi.ghan@gmail.com>"

# Show all node logs
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV=production
WORKDIR /core-services


RUN apk add --update \
    --repository http://nl.alpinelinux.org/alpine/v3.18/main \
    vips-tools \
    wget \
    imagemagick \
    python3 \
    unrar \
    p7zip \
    nodejs \
    npm \
    xvfb \
    xz

COPY package.json package-lock.json ./
COPY moleculer.config.ts ./
COPY tsconfig.json ./

RUN npm i
# Install Dependncies
RUN npm install -g typescript ts-node

COPY . .

# Build and cleanup
RUN npm run build \
    && npm prune


EXPOSE 3000
# Start server
CMD ["npm", "start"]
