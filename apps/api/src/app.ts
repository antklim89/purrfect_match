import './lib/env';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

import { adRoute } from '@/ad/routes';
import { authRoute } from '@/auth/routes';
import { corsMiddleware, loggerMiddleware, notFoundMiddleware, onErrorMiddleware } from '@/lib/middlewares';
import { profileRoute } from './profile/routes';

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
