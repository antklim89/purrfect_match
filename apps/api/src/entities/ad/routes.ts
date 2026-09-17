import { AdDraftSchema, AdFilterSchema } from '@purrfect_match/shared/entities/ad/schemas';
import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';

import { authMiddleware, schemaMiddleware } from '@/models/middlewares';
import { uploadMiddleware } from '@/models/middlewares/upload-middleware';
import { uuidParamsMiddleware } from '@/models/middlewares/uuid-params-middleware';
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
  .basePath('ad')
  .get('/', schemaMiddleware('query', AdFilterSchema), async (c) => {
    const query = c.req.valid('query');

    const result = await adFindManyService(query);
    return c.json(result);
  })
  .get('/:adId', uuidParamsMiddleware('adId'), async (c) => {
    const { adId } = c.req.valid('param');

    const result = await adFindOneService({ adId });
    return c.json(result);
  })
  .delete('/:adId', uuidParamsMiddleware('adId'), authMiddleware, async (c) => {
    const user = c.get('user');
    const { adId } = c.req.valid('param');

    await adDeleteService({ userId: user.id, adId });
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
    uploadMiddleware('image'),
    async (c) => {
      const user = c.get('user');
      const image = c.get('image');

      const result = await adUploadImageDraftService({ userId: user.id, image });

      return c.json(result);
    },
  )
  .patch('/:adImageId/delete-image-draft', uuidParamsMiddleware('adImageId'), authMiddleware, async (c) => {
    const user = c.get('user');
    const { adImageId } = c.req.valid('param');

    const result = await adDeleteImageDraftService({ userId: user.id, adImageId });
    return c.json(result);
  })
  .patch('/publish-draft', authMiddleware, async (c) => {
    const user = c.get('user');
    const result = await adPublishDraftService({ userId: user.id });

    return c.json(result);
  })
  .patch('/:adId/toggle-publish', uuidParamsMiddleware('adId'), authMiddleware, async (c) => {
    const user = c.get('user');
    const { adId } = c.req.valid('param');

    const result = await adTogglePublishService({ userId: user.id, adId });
    return c.json(result);
  });
