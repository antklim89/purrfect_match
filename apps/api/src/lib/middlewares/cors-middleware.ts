import { env } from 'bun';
import { cors } from 'hono/cors';
import { createMiddleware } from 'hono/factory';

export const corsMiddleware = createMiddleware(
  cors({
    origin: env.WEB_URL,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);
