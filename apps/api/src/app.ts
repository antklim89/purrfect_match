import './lib/env';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { authRoutes } from '@/api/auth/route';
import { env } from '@/api/lib/env';
import { adRoutes } from './ad/route';

const app = new Hono()
  .basePath('api')
  .use(
    '*',
    cors({
      origin: env.WEB_URL,
      credentials: true,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }),
  )
  .route('ad', adRoutes)
  .route('auth', authRoutes)
  .get('/', async c => c.json({ message: 'ok' }));

export default app;
export type AppType = typeof app;
