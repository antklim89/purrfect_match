import { Hono } from 'hono';
import './lib/env';

import { adRoute } from '@/ad/routes';
import { authRoute } from '@/auth/routes';
import { corsMiddleware, onErrorMiddleware } from './lib/middlewares';

export const app = new Hono()
  .basePath('api')
  .use(corsMiddleware)
  .get('/', async c => c.json({ message: 'ok' }))
  .route('ad', adRoute)
  .route('auth', authRoute)
  .onError(onErrorMiddleware);

export default app;

export type AppType = typeof app;
