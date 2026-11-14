import { DomainError } from '../DomainError';

export class UnsupportedAspectRatioError extends DomainError {
  readonly code = 'unsupported_aspect_ratio';

  constructor(readonly requested: string) {
    super(`Aspect ratio "${requested}" is not supported`);
  }
}
