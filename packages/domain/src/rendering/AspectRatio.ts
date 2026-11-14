import { UnsupportedAspectRatioError } from './UnsupportedAspectRatioError';

const WIDTH_OVER_HEIGHT = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '3:2': 3 / 2,
  '1:1': 1,
  '4:5': 4 / 5,
  '9:16': 9 / 16,
  'A-landscape': Math.SQRT2,
  'A-portrait': 1 / Math.SQRT2,
} as const;

export type AspectRatioCode = keyof typeof WIDTH_OVER_HEIGHT;

const SUPPORTED_CODES = Object.keys(WIDTH_OVER_HEIGHT) as readonly AspectRatioCode[];

function isSupportedCode(code: string): code is AspectRatioCode {
  return Object.hasOwn(WIDTH_OVER_HEIGHT, code);
}

export class AspectRatio {
  private constructor(
    readonly code: AspectRatioCode,
    readonly widthOverHeight: number,
  ) {}

  static fromCode(code: string): AspectRatio {
    if (!isSupportedCode(code)) {
      throw new UnsupportedAspectRatioError(code);
    }
    return new AspectRatio(code, WIDTH_OVER_HEIGHT[code]);
  }

  static supportedCodes(): readonly AspectRatioCode[] {
    return SUPPORTED_CODES;
  }

  isPortrait(): boolean {
    return this.widthOverHeight < 1;
  }

  longOverShortEdge(): number {
    return this.isPortrait() ? 1 / this.widthOverHeight : this.widthOverHeight;
  }
}
