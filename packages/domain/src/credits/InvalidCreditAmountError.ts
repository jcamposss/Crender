import { DomainError } from '../DomainError';

export class InvalidCreditAmountError extends DomainError {
  readonly code = 'invalid_credit_amount';

  constructor(readonly amount: number) {
    super(`Credits must be a non-negative safe integer, got ${String(amount)}`);
  }
}
