export interface Ok<T = unknown> {
  result: T;
  error?: null;
}

export interface Err<T extends string = string, I extends Issues = Issues> {
  error: ErrVariant<T, I>;
  result?: null;
}

export type Issues = Record<string, string | string[]>;

export interface ErrVariant<T extends string = string, I extends Issues = Issues> {
  type: T;
  message: string;
  original?: unknown;
  issues?: I;
}

export type Result<T = unknown, E extends string = string, I extends Issues = Issues> = Ok<T> | Err<E, I>;
export type PromiseResult<T = unknown, E extends string = string, I extends Issues = Issues> = Promise<Result<T, E, I>>;

export function ok<const T>(result: T): Ok<T> {
  return {
    error: null,
    result,
  };
}

export function err<const T extends string, const I extends Issues>(
  error: ErrVariant<T, I>,
): Err<T, I> {
  return {
    error,
    result: null,
  };
}

export function errMap<const OldErr extends NewErr, const NewErr extends string, const R, I extends Issues = Issues>(
  result: Result<R, OldErr, I>,
  errCb: (arg: ErrVariant<OldErr, I>) => ErrVariant<NewErr, I>,
): Result<R, NewErr, I> {
  if (!result.error) return result;
  return err(errCb(result.error));
}

export function okMap<const OldResult extends NewResult, const NewResult, const E extends string, I extends Issues = Issues>(
  result: Result<OldResult, E, I>,
  okCb: (arg: OldResult) => NewResult,
): Result<NewResult, E, I> {
  if (result.error) return result;
  return ok(okCb(result.result));
}

export const ErrType = {
  AUTHENTICATION: 'authentication',
  CONFLICT: 'conflict',
  NOT_FOUND: 'not_found',
  UNEXPECTED: 'unexpected',
  VALIDATION: 'validation',
} as const;
export type ErrType = (typeof ErrType)[keyof typeof ErrType];

export function errUnexpected(message?: string): Err<'unexpected'> {
  return err({
    message: message ?? 'Unexpected error. Try again later.',
    type: ErrType.UNEXPECTED,
  });
}
export function errNotFound(message?: string): Err<'not_found'> {
  return err({
    message: message ?? 'Not found. Try again later.',
    type: ErrType.NOT_FOUND,
  });
}

export function errAuthentication(message?: string): Err<'authentication'> {
  return err({
    message: message ?? 'You are not authenticated to perform this operation.',
    type: ErrType.AUTHENTICATION,
  });
}

export function errValidation<I extends Issues = Issues>(message?: string, issues?: I): Err<'validation', I> {
  return err({
    issues,
    message: message ?? 'Validation error. Please check your input.',
    type: ErrType.VALIDATION,
  });
}

export function errConflict(message?: string): Err<'conflict'> {
  return err({
    message: message ?? 'There was a conflict during the operation. Please check your input.',
    type: ErrType.CONFLICT,
  });
}
