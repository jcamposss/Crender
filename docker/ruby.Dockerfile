# SketchUp 2024+ embeds Ruby 3.2; RuboCop still targets 2.7 for SketchUp 2022/2023.
FROM ruby:3.2-slim

# Compiler for native extensions of dev-only gems (rubocop -> json, prism). The SketchUp
# extension itself ships no native code.
RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /repo/apps/sketchup-extension
