import { DomainError } from '../DomainError';

export class InsufficientCreditsError extends DomainError {
  readonly code = 'insufficient_credits';

  constructor(
    readonly available: number,
    readonly required: number,
  ) {
    super(`Required ${String(required)} credits but only ${String(available)} are available`);
  }
}
