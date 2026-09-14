import './lib/env';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';

import { adRoute } from '@/entities/ad/routes';
import { authRoute } from '@/entities/auth/routes';
import { userRoute } from '@/entities/user/routes';
import { corsMiddleware, loggerMiddleware, notFoundMiddleware, onErrorMiddleware } from '@/models/middlewares';

const app = new Hono()
  .use(corsMiddleware)
  .use('/media/*', serveStatic())
  .use(loggerMiddleware)
  .get('/', async (c) => c.json({ message: 'ok' }))
  .route('/api/auth', authRoute)
  .route('/api/user', userRoute)
  .route('/api/ad', adRoute)
  .onError(onErrorMiddleware)
  .notFound(notFoundMiddleware);

export default app;

export type AppType = typeof app;
