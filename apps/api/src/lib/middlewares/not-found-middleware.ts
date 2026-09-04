import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import type { Context } from 'hono';

export const notFoundMiddleware = (c: Context): Response => {
  return c.json({ message: 'Not found.' }, StatusCode.NOT_FOUND);
};
