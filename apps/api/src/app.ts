import './lib/env';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

import { adRoute } from '@/entities/ad/routes';
import { authRoute } from '@/entities/auth/routes';
import { profileRoute } from '@/entities/profile/routes';
import { corsMiddleware, loggerMiddleware, notFoundMiddleware, onErrorMiddleware } from '@/models/middlewares';

const app = new Hono()
  .use(corsMiddleware)
  .use('/media/*', serveStatic())
  .use(loggerMiddleware)
  .get('/', async (c) => c.json({ message: 'ok' }))
  .route('/api/ad', adRoute)
  .route('/api/auth', authRoute)
  .route('/api/profile', profileRoute)
  .onError(onErrorMiddleware)
  .notFound(notFoundMiddleware);

export default app;

export type AppType = typeof app;
