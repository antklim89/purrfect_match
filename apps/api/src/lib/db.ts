import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';

const sqlite = new Database('./db/database.db');
export const db = drizzle(sqlite);

export const migrateDb = () => {
  migrate(db, { migrationsFolder: './db/migrations' });
};
