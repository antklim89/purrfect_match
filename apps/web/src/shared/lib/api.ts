import { hc } from 'hono/client';

import { env } from './env';
import type { AppType } from '../types/api/app';

export const client = hc<AppType>(env.WEB_URL);
