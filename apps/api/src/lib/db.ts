import { drizzle } from 'drizzle-orm/postgres-js';

import { relations } from '@/schema';
import { env } from './env';

export const db = drizzle({ connection: env.DATABASE_URL, relations });
