import { env } from 'bun';
import { zValidator } from '@hono/zod-validator';
import { StatusCode } from '@purrfect_match/shared/lib/status-codes';
import type { User } from 'better-auth';
import type { Context, ValidationTargets } from 'hono';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { HTTPResponseError } from 'hono/types';
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
    zValidator(target, schema, (result) => {
      if (result.success === false)
        throw new HTTPException(StatusCode.CLIENT_ERROR, { message: prettifyError(result.error) });
    }),
  );
};

export const authMiddleware = createMiddleware<
  { Variables: { user: User } },
  string,
  { outputFormat: undefined },
  Response
>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) throw new HTTPException(StatusCode.AUTHENTICATION, { message: 'You are not authenticated' });

  c.set('user', session.user);
  await next();
});

export const tryAuthMiddleware = createMiddleware<{ Variables: { user?: User } }>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (session) c.set('user', session.user);

  await next();
});

export const onErrorMiddleware = (error: Error | HTTPResponseError, c: Context): Response => {
  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status);
  }
  console.error('Unexpected Error:\n', error);
  return c.json({ message: 'Unexpected error. Try again later.' }, StatusCode.SERVER_ERROR);
};

export const notFoundMiddleware = (c: Context): Response => {
  return c.json({ message: 'Not found.' }, StatusCode.NOT_FOUND);
};
