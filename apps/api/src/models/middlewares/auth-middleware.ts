import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import type { User } from 'better-auth';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import { auth } from '@/lib/auth';

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
