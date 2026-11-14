# 0004 — Hexagonal architecture and package dependency rule

Status: accepted · 2026-11-13

## Context

AI providers, payment gateway and storage will change over the product's life (docs/02,
section 1). Business rules (credits, pricing, prompts) must be testable without I/O.

## Decision

Layers and allowed imports, enforced by `no-restricted-imports` in `eslint.config.js`:

| Package | May import |
|---|---|
| `domain` | nothing from the workspace, no `node:*` modules |
| `application`, `prompt-builder`, `contracts` | `domain` |
| `infrastructure` | `domain`, `application`, `contracts` |
| `apps/plugin-ui` | `domain`, `contracts`, `prompt-builder` |
| other apps | any package |

Each package's `tsconfig.json` sets `rootDir: src`, so a relative import into another package
fails type checking (TS6059). The plugin UI is barred from `application` and
`infrastructure` because it runs on the customer's machine.

## Consequences

- No extra lint dependency; the rule is plain ESLint configuration.
- New packages must be added to the rule explicitly; an unlisted package can import
  anything until it is.
