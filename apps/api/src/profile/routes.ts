import { ProfileUpdateSchema } from '@purrfect_match/shared/entities/profile/schemas';
import { StatusCode } from '@purrfect_match/shared/lib/status-codes';
import { Hono } from 'hono';

import { authMiddleware, schemaMiddleware } from '@/lib/middlewares';
import { profileGetService, profileUpdateService } from './services';

export const profileRoute = new Hono()
  .get('/get-profile', authMiddleware, async (c) => {
    const user = c.get('user');

    const result = await profileGetService({ userId: user.id });
    return c.json(result);
  })
  .post('/update-profile', schemaMiddleware('json', ProfileUpdateSchema), authMiddleware, async (c) => {
    const user = c.get('user');
    const input = c.req.valid('json');

    await profileUpdateService({ userId: user.id, input });
    return c.body(null, StatusCode.NO_CONTENT);
  });
