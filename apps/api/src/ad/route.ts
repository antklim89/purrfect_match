import { Hono } from 'hono';

import { createAdService } from './service';
import { createAdValidator } from './validator';
import { auth } from '../lib/auth';

const app = new Hono().post('/', createAdValidator, async c => {
  const session = await auth.api.getSession();
  if (!session) {
    return c.json({
      error: 'You are not authenticated',
    });
  }

  const input = c.req.valid('json');
  const [result] = await createAdService({ userId: session.user.id, input });

  return c.json(result);
});

export const adRoutes = app;
