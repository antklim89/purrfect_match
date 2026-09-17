import { drizzle } from 'drizzle-orm/pglite';

import * as schema from '@/schema';

export const testDb = drizzle({ schema, casing: 'snake_case' });
