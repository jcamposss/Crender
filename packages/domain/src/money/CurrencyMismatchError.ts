import { DomainError } from '../DomainError';
import type { CurrencyCode } from './Money';

export class CurrencyMismatchError extends DomainError {
  readonly code = 'currency_mismatch';

  constructor(
    readonly expected: CurrencyCode,
    readonly received: CurrencyCode,
  ) {
    super(`Cannot combine ${expected} with ${received}`);
  }
}
