import { describe, expect, it } from 'vitest';
import { AspectRatio } from './AspectRatio';
import { OutputResolution } from './OutputResolution';
import { UnsupportedOutputResolutionError } from './UnsupportedOutputResolutionError';

const dimensions = (resolution: string, ratio: string) =>
  OutputResolution.fromCode(resolution).dimensionsFor(AspectRatio.fromCode(ratio));

describe('OutputResolution', () => {
  it('supports 1K, 2K and 4K', () => {
    expect(OutputResolution.supportedCodes()).toEqual(['1K', '2K', '4K']);
  });

  it('rejects unsupported codes', () => {
    expect(() => OutputResolution.fromCode('8K')).toThrow(UnsupportedOutputResolutionError);
  });

  it('places the long edge on the width for landscape ratios', () => {
    expect(dimensions('1K', '16:9')).toEqual({ width: 1024, height: 576 });
    expect(dimensions('2K', '4:3')).toEqual({ width: 2048, height: 1536 });
    expect(dimensions('4K', '16:9')).toEqual({ width: 4096, height: 2304 });
  });

  it('places the long edge on the height for portrait ratios', () => {
    expect(dimensions('1K', '9:16')).toEqual({ width: 576, height: 1024 });
    expect(dimensions('1K', '4:5')).toEqual({ width: 816, height: 1024 });
  });

  it('produces a square for 1:1', () => {
    expect(dimensions('2K', '1:1')).toEqual({ width: 2048, height: 2048 });
  });

  it('rounds the short edge to a multiple of 16 pixels', () => {
    expect(dimensions('1K', '3:2')).toEqual({ width: 1024, height: 688 });
    expect(dimensions('1K', 'A-landscape')).toEqual({ width: 1024, height: 720 });
    expect(dimensions('1K', 'A-portrait')).toEqual({ width: 720, height: 1024 });
  });

  it('keeps every supported combination on the 16 pixel grid', () => {
    for (const resolution of OutputResolution.supportedCodes()) {
      for (const ratio of AspectRatio.supportedCodes()) {
        const { width, height } = dimensions(resolution, ratio);

        expect(width % 16).toBe(0);
        expect(height % 16).toBe(0);
      }
    }
  });
});
