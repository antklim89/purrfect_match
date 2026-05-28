import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { beforeEach, vi } from 'vitest';

import * as schema from '@/schema';

beforeEach(() => faker.seed(1));
faker.seed(1);

vi.mock('../lib/constants.ts', async getOrigExport => {
  const origExport = (await getOrigExport()) as typeof import('../lib/constants.ts');
  return {
    ...origExport,
    MEDIA_ROOT_FOLDER: resolve(tmpdir(), 'purrfect-match-test', 'media/images'),
  };
});

const testDb = drizzle({ schema });
await migrate(testDb, { migrationsFolder: resolve('./db/migrations') });

vi.mock('../lib/db', () => {
  return { db: testDb, foo: 'bar' };
});

beforeEach(async () => {
  await Promise.all(
    Object.values(schema).map(async table => {
      if (table instanceof PgTable) {
        await testDb.execute(sql`TRUNCATE TABLE ${table} CASCADE`);
      }
    }),
  );
});
