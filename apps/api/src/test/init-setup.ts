import { resolve } from 'node:path';
import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { beforeEach, vi } from 'vitest';

import { relations } from '@/schema';
import { ENTITY_AD, SERVER_GLOBAL } from './mock-constants';
import { testDb } from './test-db';

beforeEach(() => faker.seed(1));
faker.seed(1);

vi.mock('../lib/constants', async (getOrigExport) => {
  const origExport = (await getOrigExport()) as typeof import('../models/constants');
  return { ...origExport, ...SERVER_GLOBAL };
});

vi.mock('@purrfect_match/shared/entities/ad/constants', async (getOrigExport) => {
  const origExport = (await getOrigExport()) as typeof import('@purrfect_match/shared/entities/ad/constants');
  return { ...origExport, ...ENTITY_AD };
});

await migrate(testDb, { migrationsFolder: resolve('./db/migrations') });

vi.mock('../lib/db', () => {
  return { db: testDb, foo: 'bar' };
});

beforeEach(async () => {
  await Promise.all(
    Object.values(relations).map(async ({ table }) => {
      await testDb.execute(sql`TRUNCATE TABLE ${table} CASCADE`);
    }),
  );
});
