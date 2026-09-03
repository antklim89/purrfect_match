import { resolve } from 'node:path';
import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { beforeEach, vi } from 'vitest';

import * as schema from '@/schema';
import { ENTITY_AD, SERVER_GLOBAL } from './mock-constants';

beforeEach(() => faker.seed(1));
faker.seed(1);

vi.mock('../lib/constants', async (getOrigExport) => {
  const origExport = (await getOrigExport()) as typeof import('../lib/constants');
  return { ...origExport, ...SERVER_GLOBAL };
});

vi.mock('@purrfect_match/shared/entities/ad/constants', async (getOrigExport) => {
  const origExport = (await getOrigExport()) as typeof import('@purrfect_match/shared/entities/ad/constants');
  return { ...origExport, ...ENTITY_AD };
});

const testDb = drizzle({ schema });
await migrate(testDb, { migrationsFolder: resolve('./db/migrations') });

vi.mock('../lib/db', () => {
  return { db: testDb, foo: 'bar' };
});

beforeEach(async () => {
  await Promise.all(
    Object.values(schema).map(async (table) => {
      if (table instanceof PgTable) {
        await testDb.execute(sql`TRUNCATE TABLE ${table} CASCADE`);
      }
    }),
  );
});
