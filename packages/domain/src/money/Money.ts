import { CurrencyMismatchError } from './CurrencyMismatchError';
import { InvalidMoneyAmountError } from './InvalidMoneyAmountError';

export type CurrencyCode = 'BRL' | 'USD';

const BASIS_POINTS_PER_WHOLE = 10_000n;

export class Money {
  private constructor(
    readonly cents: number,
    readonly currency: CurrencyCode,
  ) {}

  static ofCents(cents: number, currency: CurrencyCode): Money {
    if (!Number.isSafeInteger(cents) || cents < 0) {
      throw new InvalidMoneyAmountError(cents);
    }
    return new Money(cents, currency);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.ofCents(this.cents + other.cents, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.ofCents(this.cents - other.cents, this.currency);
  }

  /**
   * Returns `basisPoints / 10000` of this amount, rounding half up so a 50% share of
   * R$ 0,05 is R$ 0,03. BigInt keeps the intermediate product exact for any safe amount.
   */
  portion(basisPoints: number): Money {
    if (!Number.isSafeInteger(basisPoints) || basisPoints < 0) {
      throw new RangeError(
        `Basis points must be a non-negative integer, got ${String(basisPoints)}`,
      );
    }
    const scaled = BigInt(this.cents) * BigInt(basisPoints);
    const rounded = (scaled * 2n + BASIS_POINTS_PER_WHOLE) / (BASIS_POINTS_PER_WHOLE * 2n);
    return Money.ofCents(Number(rounded), this.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.cents > other.cents;
  }

  equals(other: Money): boolean {
    return this.currency === other.currency && this.cents === other.cents;
  }

  private assertSameCurrency(other: Money): void {
    if (other.currency !== this.currency) {
      throw new CurrencyMismatchError(this.currency, other.currency);
    }
  }
}
