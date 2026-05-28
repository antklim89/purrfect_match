import { env } from 'bun';
import { zValidator } from '@hono/zod-validator';
import {
  type Err,
  errAuthentication,
  errUnexpected,
  errValidation,
  type Issues,
} from '@purrfect_match/shared/lib/result';
import type { User } from 'better-auth';
import type { Context, ValidationTargets } from 'hono';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import type { HTTPResponseError, Input, TypedResponse } from 'hono/types';
import { prettifyError, type ZodObject } from 'zod';
import type { ZodMiniObject } from 'zod/v4-mini';

import { auth } from './auth';

export const corsMiddleware = createMiddleware(
  cors({
    origin: env.WEB_URL,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

export const schemaMiddleware = <Schema extends ZodObject | ZodMiniObject, Target extends keyof ValidationTargets>(
  target: Target,
  schema: Schema,
) => {
  return createMiddleware(
    zValidator(target, schema, (result, c) => {
      if (result.success === false) return c.json(errValidation(prettifyError(result.error)));
    }),
  );
};

export const authMiddleware = createMiddleware<
  { Variables: { user: User } },
  string,
  Input,
  Response & TypedResponse<Err<'authentication', Issues>, 401, 'json'>
>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json(errAuthentication(), 401);

  c.set('user', session.user);
  await next();
});

export const tryAuthMiddleware = createMiddleware<{ Variables: { user?: User } }>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (session) c.set('user', session.user);

  await next();
});

export const onErrorMiddleware = (
  error: Error | HTTPResponseError,
  c: Context,
): Response & TypedResponse<Err<'unexpected', Issues>, 500, 'json'> => {
  console.error('Unexpected Error:\n', error);
  return c.json(errUnexpected(), 500);
};
