# 0006 — Allowed AI models and licenses

Status: accepted · 2026-11-13

## Context

A model whose license forbids commercial use would put the business at legal risk
(docs/01, section 11).

## Decision

Allowed:

| Use | Model | Basis |
|---|---|---|
| Previews, economy and premium renders | BFL hosted API (FLUX 3 Image Klein) | Commercial use through the official API |
| Fallback | Google Gemini Flash Image API | Commercial use through the API |
| Self-hosted (future) | FLUX.2 [klein] 4B | Apache 2.0 |
| Upscale | Real-ESRGAN through an API provider | Provider terms to be verified before use |

Forbidden without a new ADR and legal review: any `[dev]` model (FLUX.1 dev, FLUX.2 dev,
Kontext dev) and FLUX.2 klein 9B on own infrastructure.

Model configuration (provider, identifier, version, unit price in USD, stage) lives in a
versioned table; every generated asset records the model and the effective cost.

## Consequences

- Each provider's data retention and training policy must be checked and recorded before
  its adapter ships (images are never used for training, docs/01).
- Model names, prices and resolution limits in docs/01 are estimates; they are confirmed
  against the provider documentation in Phase 1.
