# use the official Bun image
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile
COPY / ./

# run the app
USER bun
EXPOSE  3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]
