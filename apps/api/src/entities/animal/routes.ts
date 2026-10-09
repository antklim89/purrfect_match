import { Hono } from 'hono';
import { z } from 'zod/v4-mini';

import { schemaMiddleware } from '@/models/middlewares';
import { animalFindManyService, animalFindOneService } from './services';

export const animalRoute = new Hono()
  .basePath('animal')
  .get('/', async (c) => {
    const result = await animalFindManyService();
    return c.json(result);
  })
  .get('/:name', schemaMiddleware('param', z.object({ name: z.string() })), async (c) => {
    const { name } = c.req.valid('param');
    const result = await animalFindOneService({ name });
    return c.json(result);
  });
