import type { AspectRatio } from './AspectRatio';
import { UnsupportedOutputResolutionError } from './UnsupportedOutputResolutionError';

const LONG_EDGE_PX = {
  '1K': 1024,
  '2K': 2048,
  '4K': 4096,
} as const;

// Diffusion models generate in a latent grid downsampled by 16; other sizes get cropped or
// padded by the provider. Confirm against the BFL size limits in Phase 1.
const PIXEL_GRID = 16;

export type OutputResolutionCode = keyof typeof LONG_EDGE_PX;

export interface PixelDimensions {
  readonly width: number;
  readonly height: number;
}

const SUPPORTED_CODES = Object.keys(LONG_EDGE_PX) as readonly OutputResolutionCode[];

function isSupportedCode(code: string): code is OutputResolutionCode {
  return Object.hasOwn(LONG_EDGE_PX, code);
}

function snapToGrid(pixels: number): number {
  return Math.round(pixels / PIXEL_GRID) * PIXEL_GRID;
}

export class OutputResolution {
  private constructor(
    readonly code: OutputResolutionCode,
    readonly longEdgePx: number,
  ) {}

  static fromCode(code: string): OutputResolution {
    if (!isSupportedCode(code)) {
      throw new UnsupportedOutputResolutionError(code);
    }
    return new OutputResolution(code, LONG_EDGE_PX[code]);
  }

  static supportedCodes(): readonly OutputResolutionCode[] {
    return SUPPORTED_CODES;
  }

  dimensionsFor(aspectRatio: AspectRatio): PixelDimensions {
    const shortEdgePx = snapToGrid(this.longEdgePx / aspectRatio.longOverShortEdge());
    return aspectRatio.isPortrait()
      ? { width: shortEdgePx, height: this.longEdgePx }
      : { width: this.longEdgePx, height: shortEdgePx };
  }
}
