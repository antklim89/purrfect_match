import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import { Hono } from 'hono';

import { authMiddleware } from '@/models/middlewares';
import { uuidParamsMiddleware } from '@/models/middlewares/uuid-params-middleware';
import { deleteFavoriteService, insertFavoriteService } from './services';

export const favoriteRoute = new Hono()
  .basePath('/ad/:adId/favorite')
  .post('/', authMiddleware, uuidParamsMiddleware('adId'), async (c) => {
    const { adId } = c.req.valid('param');
    const { id: userId } = c.get('user');

    await insertFavoriteService({ adId, userId });
    return c.body(null, StatusCode.NO_CONTENT);
  })
  .delete('/', authMiddleware, uuidParamsMiddleware('adId'), async (c) => {
    const { adId } = c.req.valid('param');
    const { id: userId } = c.get('user');

    await deleteFavoriteService({ adId, userId });
    return c.body(null, StatusCode.NO_CONTENT);
  });
