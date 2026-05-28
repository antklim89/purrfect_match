import { Hono } from 'hono';
import './lib/env';

import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';

import { adRoute } from '@/ad/routes';
import { authRoute } from '@/auth/routes';
import { corsMiddleware, notFoundMiddleware, onErrorMiddleware } from '@/lib/middlewares';

const app = new Hono()
  .use(corsMiddleware)
  .use('/media/*', serveStatic())
  .use(logger())
  .get('/', async c => c.json({ message: 'ok' }))
  .route('/api/ad', adRoute)
  .route('/api/auth', authRoute)
  .onError(onErrorMiddleware)
  .notFound(notFoundMiddleware);

export default app;

export type AppType = typeof app;
