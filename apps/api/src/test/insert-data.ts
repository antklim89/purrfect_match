import type { PgTable, TableConfig } from 'drizzle-orm/pg-core';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { createTestUserData } from './test-data';

export function insertListData<Table extends PgTable<TableConfig>>(
  table: Table,
  data: (index: number) => Table['$inferInsert'],
  quantity = 1,
) {
  return db
    .insert(table)
    .values(Array.from({ length: quantity }, (_, index) => data(index)))
    .returning();
}

export async function insertData<Table extends PgTable<TableConfig>>(
  table: Table,
  data: Table['$inferInsert'],
): Promise<Table['$inferSelect']> {
  const [result] = await db.insert(table).values(data).returning();

  if (!result) throw new Error('Failed to create test ad.');
  return result;
}

export async function registerTestUser() {
  const ctx = await auth.$context;
  const user = await ctx.test.saveUser(createTestUserData());
  const loginResult = await ctx.test.login({ userId: user.id });
  const headers = Object.fromEntries(loginResult.headers);

  return { ...loginResult, headers };
}
