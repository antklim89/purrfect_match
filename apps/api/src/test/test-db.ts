import { drizzle } from 'drizzle-orm/pglite';

import { relations } from '@/schema';

export const testDb = drizzle({ relations });
