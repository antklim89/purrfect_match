import { migrateDb } from './lib/db';

// Run migrations
migrateDb();

// biome-ignore lint/suspicious/noConsole: ok
console.log('Database migration completed');
process.exit(0);
