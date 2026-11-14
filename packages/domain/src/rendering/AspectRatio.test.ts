import { describe, expect, it } from 'vitest';
import { AspectRatio } from './AspectRatio';
import { UnsupportedAspectRatioError } from './UnsupportedAspectRatioError';

describe('AspectRatio', () => {
  it('supports the ratios offered to the architect', () => {
    expect(AspectRatio.supportedCodes()).toEqual([
      '16:9',
      '4:3',
      '3:2',
      '1:1',
      '4:5',
      '9:16',
      'A-landscape',
      'A-portrait',
    ]);
  });

  it('parses a supported code', () => {
    const ratio = AspectRatio.fromCode('16:9');

    expect(ratio.code).toBe('16:9');
    expect(ratio.widthOverHeight).toBeCloseTo(16 / 9);
  });

  it('uses the square root of two for A-series paper sizes', () => {
    expect(AspectRatio.fromCode('A-landscape').widthOverHeight).toBeCloseTo(Math.SQRT2);
    expect(AspectRatio.fromCode('A-portrait').widthOverHeight).toBeCloseTo(1 / Math.SQRT2);
  });

  it('rejects unsupported codes', () => {
    expect(() => AspectRatio.fromCode('21:9')).toThrow(UnsupportedAspectRatioError);
  });

  it('does not accept inherited object keys as codes', () => {
    expect(() => AspectRatio.fromCode('toString')).toThrow(UnsupportedAspectRatioError);
  });

  it('knows its orientation', () => {
    expect(AspectRatio.fromCode('4:3').isPortrait()).toBe(false);
    expect(AspectRatio.fromCode('1:1').isPortrait()).toBe(false);
    expect(AspectRatio.fromCode('9:16').isPortrait()).toBe(true);
    expect(AspectRatio.fromCode('4:5').isPortrait()).toBe(true);
  });
});
