import { AdDraftSchema, AdFilterSchema } from '@purrfect_match/shared/entities/ad/schemas';
import { uuidv7Schema } from '@purrfect_match/shared/lib/schemas';
import { StatusCode } from '@purrfect_match/shared/lib/status-codes';
import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { z } from 'zod/v4-mini';

import { authMiddleware, schemaMiddleware } from '@/lib/middlewares';
import {
  adDeleteImageDraftService,
  adDeleteService,
  adFindManyService,
  adFindOneService,
  adGetDraftService,
  adPublishDraftService,
  adTogglePublishService,
  adUpdateDraftService,
  adUploadImageDraftService,
} from './services';

export const adRoute = new Hono()
  .get('/', schemaMiddleware('query', AdFilterSchema), async (c) => {
    const query = c.req.valid('query');

    const result = await adFindManyService(query);
    return c.json(result);
  })
  .get('/:id', schemaMiddleware('param', uuidv7Schema), async (c) => {
    const { id } = c.req.valid('param');

    const result = await adFindOneService({ id });
    return c.json(result);
  })
  .delete('/:id', schemaMiddleware('param', uuidv7Schema), authMiddleware, async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');

    await adDeleteService({ userId: user.id, id });
    return c.body(null, StatusCode.NO_CONTENT);
  })
  .post('/get-draft', authMiddleware, async (c) => {
    const user = c.get('user');

    const result = await adGetDraftService({ userId: user.id });
    return c.json(result);
  })
  .patch('/update-draft', authMiddleware, schemaMiddleware('json', AdDraftSchema), async (c) => {
    const user = c.get('user');
    const input = c.req.valid('json');

    const result = await adUpdateDraftService({ userId: user.id, input });
    return c.json(result);
  })
  .patch(
    '/upload-image-draft',
    bodyLimit({ maxSize: 4 * 1024 * 1024 }),
    authMiddleware,
    schemaMiddleware('form', z.object({ image: z.file() })),
    async (c) => {
      const user = c.get('user');
      const { image } = c.req.valid('form');
      const result = await adUploadImageDraftService({ userId: user.id, image });

      return c.json(result);
    },
  )
  .patch('/:id/delete-image-draft', schemaMiddleware('param', uuidv7Schema), authMiddleware, async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');

    const result = await adDeleteImageDraftService({ userId: user.id, adImageId: id });
    return c.json(result);
  })
  .patch('/publish-draft', authMiddleware, async (c) => {
    const user = c.get('user');
    const result = await adPublishDraftService({ userId: user.id });

    return c.json(result);
  })
  .patch('/:id/toggle-publish', schemaMiddleware('param', uuidv7Schema), authMiddleware, async (c) => {
    const user = c.get('user');
    const { id } = c.req.valid('param');

    const result = await adTogglePublishService({ userId: user.id, id });
    return c.json(result);
  });
