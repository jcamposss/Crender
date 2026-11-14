# 0002 — Cloudflare Workers, Queues and R2 for API, worker and storage

Status: accepted · 2026-11-13

## Context

Fixed cost must stay near zero with no usage (docs/01, section 8) and scale with demand.
Images must be private, retained for 15 days and served through short-lived signed URLs.

## Options considered

1. **Cloudflare Workers + Queues + R2**: pay per request, no idle cost, no egress fees on
   R2, S3-compatible signed URLs.
2. **AWS Lambda + SQS + S3**: mature, but egress fees and more moving parts to configure.
3. **A VPS/container platform**: simpler runtime model (native libraries available) but
   fixed monthly cost and manual scaling.

## Decision

API on Workers with Hono, generation jobs on Cloudflare Queues consumed by a Worker, images
on R2. All three are reached only through ports (`JobQueue`, `AssetStorage`).

## Consequences

- Workers have memory and CPU limits per invocation. `GeometryCheck` on 4K images must be
  measured in Phase 2; if it does not fit, it moves to WASM, downscaled comparison, or a
  different runtime behind the same port.
- Provider calls are asynchronous (submit and poll); the queue consumer owns the polling.
- Local development of Workers needs Wrangler; it will be added to the Docker image when
  the API appears (Phase 1).
