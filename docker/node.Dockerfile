FROM node:24-bookworm-slim

# zip packages the SketchUp extension (.rbz) from the same toolchain that builds its UI.
RUN apt-get update \
  && apt-get install -y --no-install-recommends zip \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm@12.18.0

WORKDIR /repo
