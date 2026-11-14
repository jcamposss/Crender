# 0001 — Monorepo with pnpm workspaces

Status: accepted · 2026-11-13

## Context

UI, API, worker and web panel share the domain, contracts and prompt builder. They must
evolve together and be checked by one CI run. The SketchUp extension is Ruby and lives in the
same repository.

## Options considered

1. **pnpm workspaces**: strict `node_modules` (a package only sees what it declares), content
   addressed store, fast installs, minimum release age policy against freshly published
   (possibly compromised) versions. MIT.
2. **npm workspaces**: no extra tool, but hoisting lets packages import undeclared
   dependencies, which weakens the layer rules.
3. **Turborepo / Nx on top**: task caching and graph; unnecessary at the current size.

## Decision

pnpm 12 workspaces (`apps/*`, `packages/*`), versions pinned exactly. Internal packages
export their TypeScript sources directly (`exports: ./src/index.ts`); there is no
per-package build step. Apps bundle what they use. One root config for ESLint, Prettier and
Vitest; one `tsconfig.json` per package with `rootDir: src`.

The Ruby extension is not a pnpm package; it has its own Gemfile and the root `build`
script packages it after the UI build.

## Consequences

- Adding a build orchestrator later (Turborepo) is cheap if CI time grows.
- pnpm's release age policy can refuse a version published in the last day; pin the previous
  one instead of adding exclusions.
- Internal packages cannot be published to npm as they are (not a goal).
