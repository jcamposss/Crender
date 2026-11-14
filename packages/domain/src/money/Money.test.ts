import { describe, expect, it } from 'vitest';
import { CurrencyMismatchError } from './CurrencyMismatchError';
import { InvalidMoneyAmountError } from './InvalidMoneyAmountError';
import { Money } from './Money';

describe('Money', () => {
  it('stores the amount as integer cents', () => {
    expect(Money.ofCents(5990, 'BRL').cents).toBe(5990);
  });

  it('rejects fractional cents', () => {
    expect(() => Money.ofCents(59.9, 'BRL')).toThrow(InvalidMoneyAmountError);
  });

  it('rejects negative amounts', () => {
    expect(() => Money.ofCents(-1, 'BRL')).toThrow(InvalidMoneyAmountError);
  });

  it('rejects amounts beyond the safe integer range', () => {
    expect(() => Money.ofCents(Number.MAX_SAFE_INTEGER + 1, 'BRL')).toThrow(
      InvalidMoneyAmountError,
    );
  });

  it('adds amounts of the same currency', () => {
    const total = Money.ofCents(5990, 'BRL').add(Money.ofCents(2390, 'BRL'));

    expect(total.equals(Money.ofCents(8380, 'BRL'))).toBe(true);
  });

  it('subtracts amounts of the same currency', () => {
    const rest = Money.ofCents(5990, 'BRL').subtract(Money.ofCents(990, 'BRL'));

    expect(rest.cents).toBe(5000);
  });

  it('refuses a subtraction that would go below zero', () => {
    expect(() => Money.ofCents(100, 'BRL').subtract(Money.ofCents(101, 'BRL'))).toThrow(
      InvalidMoneyAmountError,
    );
  });

  it('refuses to combine different currencies', () => {
    const reais = Money.ofCents(100, 'BRL');
    const dollars = Money.ofCents(100, 'USD');

    expect(() => reais.add(dollars)).toThrow(CurrencyMismatchError);
    expect(() => reais.subtract(dollars)).toThrow(CurrencyMismatchError);
    expect(() => reais.isGreaterThan(dollars)).toThrow(CurrencyMismatchError);
  });

  it('computes a portion in basis points rounding half up', () => {
    expect(Money.ofCents(2990, 'BRL').portion(2000).cents).toBe(598);
    expect(Money.ofCents(5, 'BRL').portion(5000).cents).toBe(3);
    expect(Money.ofCents(4, 'BRL').portion(5000).cents).toBe(2);
  });

  it('computes portions of large amounts without losing precision', () => {
    const amount = Money.ofCents(900_000_000_000_001, 'BRL');

    expect(amount.portion(10_000).cents).toBe(900_000_000_000_001);
  });

  it('rejects a fractional or negative basis point rate', () => {
    const amount = Money.ofCents(100, 'BRL');

    expect(() => amount.portion(12.5)).toThrow(RangeError);
    expect(() => amount.portion(-1)).toThrow(RangeError);
  });

  it('compares amounts', () => {
    const price = Money.ofCents(12990, 'BRL');

    expect(price.isGreaterThan(Money.ofCents(5990, 'BRL'))).toBe(true);
    expect(price.isGreaterThan(Money.ofCents(12990, 'BRL'))).toBe(false);
  });

  it('is equal only with the same amount and currency', () => {
    expect(Money.ofCents(100, 'BRL').equals(Money.ofCents(100, 'BRL'))).toBe(true);
    expect(Money.ofCents(100, 'BRL').equals(Money.ofCents(100, 'USD'))).toBe(false);
  });
});
