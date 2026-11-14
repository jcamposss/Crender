# 0007 — Docker as the development and CI environment

Status: accepted · 2026-11-13

## Context

The owner asked for Docker. The project mixes Node (UI, backend) and Ruby (extension
tooling), and is developed on macOS and Windows.

## Decision

Two images (`docker/node.Dockerfile`, `docker/ruby.Dockerfile`) orchestrated by
`compose.yaml`, with the repository bind-mounted. `make` targets wrap every command, and
GitHub Actions runs the same containers.

- Node 24 with pnpm and `zip` (to package the `.rbz`).
- Ruby 3.2, the version embedded in SketchUp 2024+, with a compiler for dev-only gems.
  RuboCop targets Ruby 2.7 so the code still parses on SketchUp 2022/2023.

## Consequences

- `node_modules` contains Linux binaries; running `pnpm install` on the host breaks it.
- Docker cannot run SketchUp. The extension's behaviour inside SketchUp is tested by hand on
  Windows and macOS; automated Ruby tests cover only code that does not touch the SketchUp
  API, with simple fakes.
