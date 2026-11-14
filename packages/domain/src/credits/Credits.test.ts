import { describe, expect, it } from 'vitest';
import { Credits } from './Credits';
import { InsufficientCreditsError } from './InsufficientCreditsError';
import { InvalidCreditAmountError } from './InvalidCreditAmountError';

describe('Credits', () => {
  it('holds a non-negative whole amount', () => {
    expect(Credits.of(600).amount).toBe(600);
    expect(Credits.zero().isZero()).toBe(true);
  });

  it('rejects negative amounts', () => {
    expect(() => Credits.of(-1)).toThrow(InvalidCreditAmountError);
  });

  it('rejects fractional amounts', () => {
    expect(() => Credits.of(1.5)).toThrow(InvalidCreditAmountError);
  });

  it('rejects non-finite amounts', () => {
    expect(() => Credits.of(Number.NaN)).toThrow(InvalidCreditAmountError);
    expect(() => Credits.of(Number.POSITIVE_INFINITY)).toThrow(InvalidCreditAmountError);
  });

  it('adds credits', () => {
    expect(Credits.of(600).add(Credits.of(200)).equals(Credits.of(800))).toBe(true);
  });

  it('subtracts credits down to zero', () => {
    expect(Credits.of(3).subtract(Credits.of(3)).isZero()).toBe(true);
  });

  it('never goes negative: subtracting more than available raises InsufficientCreditsError', () => {
    const attempt = () => Credits.of(2).subtract(Credits.of(3));

    expect(attempt).toThrow(InsufficientCreditsError);
    expect(attempt).toThrow(expect.objectContaining({ available: 2, required: 3 }));
  });

  it('tells whether it covers a required amount', () => {
    expect(Credits.of(3).covers(Credits.of(3))).toBe(true);
    expect(Credits.of(2).covers(Credits.of(3))).toBe(false);
  });
});
