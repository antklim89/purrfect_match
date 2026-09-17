import { Hono } from 'hono';

import { auth } from '@/lib/auth';

const app = new Hono().on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw));

export const authRoute = app;
