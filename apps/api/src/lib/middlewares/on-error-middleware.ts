import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { HTTPResponseError } from 'hono/types';

export const onErrorMiddleware = (error: Error | HTTPResponseError, c: Context): Response => {
  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status);
  }
  console.error('Unexpected Error:\n', error);
  return c.json({ message: 'Unexpected error. Try again later.' }, StatusCode.SERVER_ERROR);
};
