import { ProfileUpdateSchema } from '@purrfect_match/shared/entities/auth/schema';
import { Hono } from 'hono';

import { auth } from '@/lib/auth';
import { authMiddleware, schemaMiddleware } from '@/lib/middlewares';
import { profileGetService, profileUpdateService } from './services';

const app = new Hono()
  .get('/get-profile', authMiddleware, async c => {
    const user = c.get('user');

    const result = await profileGetService({ userId: user.id });
    return c.json(result);
  })
  .post('/update-profile', schemaMiddleware('json', ProfileUpdateSchema), authMiddleware, async c => {
    const user = c.get('user');
    const input = c.req.valid('json');

    const result = await profileUpdateService({ userId: user.id, input });
    return c.json(result);
  })
  .on(['POST', 'GET'], '*', c => auth.handler(c.req.raw));

export const authRoute = app;
