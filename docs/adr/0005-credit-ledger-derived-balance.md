# 0005 — Credit ledger with derived balance

Status: accepted · 2026-11-13

## Context

Credits are the customer's money. Failed renders must not be charged, subscription credits
are consumed before purchased ones, and both buckets expire on different schedules
(docs/01, section 7). Every movement must be auditable and retries must never double
charge.

## Options considered

1. **Mutable balance column**: simple, but loses history and makes races and retries hard
   to reason about.
2. **Append-only ledger with derived balance**: every movement is an entry; balance is a
   function of the entries.

## Decision

`CreditWallet` is an append-only ledger of `CreditEntry` (`grant`, `reserve`, `capture`,
`release`, `expire`, `refund`) per bucket (`subscription`, `purchased`). Balance is always
derived. Each entry carries a unique idempotency key. A reservation spanning buckets is
written in a single transaction. Amounts use the `Credits` value object, which cannot be
negative.

## Consequences

- Balance queries aggregate entries; a materialised snapshot may be added later for
  performance, rebuilt from the ledger and never edited directly.
- Still undefined and needed before Phase 3: how `render_with_previews` credits split
  between preview and final (for `abandoned`), and what happens when reserved subscription
  credits are released after their cycle ended.
