import { UserUpdateSchema } from '@purrfect_match/shared/entities/user/schemas';
import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import { Hono } from 'hono';

import { authMiddleware, schemaMiddleware } from '@/models/middlewares';
import { uuidParamsMiddleware } from '@/models/middlewares/uuid-params-middleware';
import { userProfileGetService, userProfileUpdateService } from './services';

export const userRoute = new Hono()
  .basePath('user')
  .get('/:userId/get-user', uuidParamsMiddleware('userId'), async (c) => {
    const { userId } = c.req.valid('param');

    const result = await userProfileGetService({ userId });

    return c.json(result);
  })
  .post('/update-user', schemaMiddleware('json', UserUpdateSchema), authMiddleware, async (c) => {
    const input = c.req.valid('json');
    const headers = c.req.raw.headers;

    await userProfileUpdateService({ headers, input });
    return c.body(null, StatusCode.NO_CONTENT);
  });
