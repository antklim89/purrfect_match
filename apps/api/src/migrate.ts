/** biome-ignore-all lint/suspicious/noConsole: ok */

import process from 'node:process';
import { migrate } from 'drizzle-orm/pg-core';

import { db } from './lib/db';

// Run migrations
try {
  await migrate([], db, { migrationsFolder: './db/migrations' });
  console.log('Database migration completed');
  process.exit(0);
} catch (error) {
  console.log('Database migration failed');
  console.error(error);
  process.exit(1);
}
