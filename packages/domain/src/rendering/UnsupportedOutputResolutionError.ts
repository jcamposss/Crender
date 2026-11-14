import { DomainError } from '../DomainError';

export class UnsupportedOutputResolutionError extends DomainError {
  readonly code = 'unsupported_output_resolution';

  constructor(readonly requested: string) {
    super(`Output resolution "${requested}" is not supported`);
  }
}
