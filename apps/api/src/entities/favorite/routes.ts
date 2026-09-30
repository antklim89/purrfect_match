import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import { Hono } from 'hono';

import { authMiddleware } from '@/models/middlewares';
import { uuidParamsMiddleware } from '@/models/middlewares/uuid-params-middleware';
import { deleteFavoriteService, favoriteFindByAdIdService, insertFavoriteService } from './services';

export const favoriteRoute = new Hono()
  .get('/ad/:adId/favorite', authMiddleware, uuidParamsMiddleware('adId'), async (c) => {
    const { adId } = c.req.valid('param');
    const { id: userId } = c.get('user');

    const favorite = await favoriteFindByAdIdService({ adId, userId });
    return c.json(favorite);
  })
  .post('/ad/:adId/favorite', authMiddleware, uuidParamsMiddleware('adId'), async (c) => {
    const { adId } = c.req.valid('param');
    const { id: userId } = c.get('user');

    await insertFavoriteService({ adId, userId });
    return c.body(null, StatusCode.NO_CONTENT);
  })
  .delete('/ad/:adId/favorite', authMiddleware, uuidParamsMiddleware('adId'), async (c) => {
    const { adId } = c.req.valid('param');
    const { id: userId } = c.get('user');

    await deleteFavoriteService({ adId, userId });
    return c.body(null, StatusCode.NO_CONTENT);
  });
