import type { AppType } from '@purrfect_match/api';
import { hc } from 'hono/client';

export const client = hc<AppType>('http://localhost:8000');
