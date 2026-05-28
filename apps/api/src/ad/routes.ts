import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';

import { authMiddleware, schemaMiddleware, tryAuthMiddleware } from '@/lib/middlewares';
import { uuidv7Schema } from '@/lib/schemas';
import { AdCreateSchema, AdFilterSchema } from './schemas';
import { adCreateService, adDeleteService, adFindManyService, adFindOneService, adPublishService } from './services';

export const adRoute = new Hono()
  .get('/', schemaMiddleware('query', AdFilterSchema), tryAuthMiddleware, async c => {
    const query = c.req.valid('query');
    const user = c.get('user');

    const result = await adFindManyService(query, user?.id);
    return c.json(result);
  })
  .get('/:id', schemaMiddleware('param', uuidv7Schema), async c => {
    const { id } = c.req.valid('param');

    const result = await adFindOneService({ id });
    return c.json(result);
  })
  .post(
    '/',
    bodyLimit({ maxSize: 10 * 1024 * 1024 }),
    schemaMiddleware('form', AdCreateSchema),
    authMiddleware,
    async c => {
      const user = c.get('user');
      const input = c.req.valid('form');

      const result = await adCreateService({ userId: user.id, input });
      return c.json(result);
    },
  )
  .delete('/:id', schemaMiddleware('param', uuidv7Schema), authMiddleware, async c => {
    const user = c.get('user');
    const { id } = c.req.valid('param');

    const result = await adDeleteService({ userId: user.id, id });
    return c.json(result);
  })
  .patch('/:id/publish', schemaMiddleware('param', uuidv7Schema), authMiddleware, async c => {
    const user = c.get('user');
    const { id } = c.req.valid('param');

    const result = await adPublishService({ userId: user.id, id });
    return c.json(result);
  });
