import { DomainError } from '../DomainError';

export class InvalidMoneyAmountError extends DomainError {
  readonly code = 'invalid_money_amount';

  constructor(readonly cents: number) {
    super(`Money must be a non-negative safe integer of cents, got ${String(cents)}`);
  }
}
