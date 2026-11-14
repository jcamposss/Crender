import { InsufficientCreditsError } from './InsufficientCreditsError';
import { InvalidCreditAmountError } from './InvalidCreditAmountError';

export class Credits {
  private constructor(readonly amount: number) {}

  static of(amount: number): Credits {
    if (!Number.isSafeInteger(amount) || amount < 0) {
      throw new InvalidCreditAmountError(amount);
    }
    return new Credits(amount);
  }

  static zero(): Credits {
    return new Credits(0);
  }

  add(other: Credits): Credits {
    return Credits.of(this.amount + other.amount);
  }

  subtract(other: Credits): Credits {
    if (!this.covers(other)) {
      throw new InsufficientCreditsError(this.amount, other.amount);
    }
    return new Credits(this.amount - other.amount);
  }

  covers(required: Credits): boolean {
    return this.amount >= required.amount;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  equals(other: Credits): boolean {
    return this.amount === other.amount;
  }
}
