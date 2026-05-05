import { Database } from 'bun:sqlite';
import { beforeEach, mock } from 'bun:test';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';

beforeEach(() => {
  mock.module('../lib/db', () => {
    const sqlite = new Database(':memory:');
    const db = drizzle(sqlite);

    const migrateDb = () => {
      migrate(db, { migrationsFolder: './db/migrations' });
    };

    migrateDb();
    return {
      db,
      migrateDb,
    };
  });
});
