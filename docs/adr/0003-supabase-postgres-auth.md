# 0003 — Supabase for Postgres and authentication

Status: accepted · 2026-11-13

## Context

The credit ledger needs real transactions and row locking (atomic multi-bucket
reservation, concurrent reservations at the balance limit). Accounts need e-mail and phone
verification.

## Options considered

1. **Supabase**: managed Postgres plus Auth (e-mail, phone OTP), free tier to start.
2. **Cloudflare D1**: SQLite at the edge, cheap, but weaker concurrency semantics for the
   ledger.
3. **Neon + separate auth provider**: good Postgres, but two vendors for what Supabase
   covers.

## Decision

Supabase Postgres as the system of record and Supabase Auth for identity. Application code
depends only on repository ports.

## Consequences

- Workers reach Postgres either through Hyperdrive (pooled TCP, real transactions) or
  through SQL functions called over HTTP. The ledger requires transactions; the choice is
  made and recorded at the start of Phase 3, backed by a concurrency test.
- Phone OTP needs an SMS provider with a per-message cost that is not yet in the unit
  economics (docs/01, section 8).
