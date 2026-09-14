import { UserProfileUpdateSchema } from '@purrfect_match/shared/entities/auth/schemas';
import { uuidv7Schema } from '@purrfect_match/shared/models/schemas';
import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import { Hono } from 'hono';

import { auth } from '@/lib/auth';
import { authMiddleware, schemaMiddleware } from '@/models/middlewares';
import { userProfileGetService, userProfileUpdateService } from './services';

const app = new Hono()
  .get('/:id/get-profile', schemaMiddleware('param', uuidv7Schema), async (c) => {
    const { id: userId } = c.req.valid('param');

    const result = await userProfileGetService({ userId });

    return c.json(result);
  })
  .post('/update-profile', schemaMiddleware('json', UserProfileUpdateSchema), authMiddleware, async (c) => {
    const input = c.req.valid('json');
    const headers = c.req.raw.headers;

    await userProfileUpdateService({ headers, input });
    return c.body(null, StatusCode.NO_CONTENT);
  })
  .on(['POST', 'GET'], '*', (c) => auth.handler(c.req.raw));

export const authRoute = app;
