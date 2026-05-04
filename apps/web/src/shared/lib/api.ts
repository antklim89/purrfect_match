import type { AppType } from '@purrfect_match/api';
import { hc } from 'hono/client';

import { env } from './env';

export const client = hc<AppType>(env.WEB_URL);
