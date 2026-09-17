import * as fs from 'node:fs/promises';
import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import { and, eq } from 'drizzle-orm';
import { testClient } from 'hono/testing';
import { beforeAll, describe, expect, it } from 'vitest';

import app from '@/app';
import { db } from '@/lib/db';
import { MEDIA_ROOT_FOLDER } from '@/models/constants';
import { adTable, favoriteTable } from '@/schema';
import { testApiCall } from '@/test/api-call';
import { insertData, registerTestUser } from '../../test/insert-data';
import { createTestAdData } from '../../test/test-data';

const client = testClient(app);

beforeAll(async () => {
  await fs.rm(MEDIA_ROOT_FOLDER, { force: true, recursive: true });
});

describe('[POST] /api/favorite', () => {
  it('should insert ad', async () => {
    const { headers, user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id, { status: 'DRAFT' }));

    await testApiCall(client.api.ad[':adId'].favorite.$post({ param: { adId: ad.id } }, { headers }));

    const [insertedFavorite] = await db
      .select()
      .from(favoriteTable)
      .where(and(eq(favoriteTable.adId, ad.id), eq(favoriteTable.userId, user.id)));

    expect(insertedFavorite).toStrictEqual({ userId: user.id, adId: ad.id });
  });

  it('should not insert ad if already exists', async () => {
    const { headers, user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id, { status: 'DRAFT' }));

    await insertData(favoriteTable, { adId: ad.id, userId: user.id });

    const { error } = await testApiCall(client.api.ad[':adId'].favorite.$post({ param: { adId: ad.id } }, { headers }));

    const insertedFavorites = await db
      .select()
      .from(favoriteTable)
      .where(and(eq(favoriteTable.adId, ad.id), eq(favoriteTable.userId, user.id)));

    expect(error).toHaveProperty('status', StatusCode.CONFLICT);
    expect(insertedFavorites).toHaveLength(1);
  });
});

describe('[DELETE] /api/favorite', () => {
  it('should delete ad', async () => {
    const { headers, user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id, { status: 'DRAFT' }));

    await insertData(favoriteTable, { adId: ad.id, userId: user.id });

    await testApiCall(client.api.ad[':adId'].favorite.$delete({ param: { adId: ad.id } }, { headers }));

    const deletedFavorites = await db
      .select()
      .from(favoriteTable)
      .where(and(eq(favoriteTable.adId, ad.id), eq(favoriteTable.userId, user.id)));

    expect(deletedFavorites).length(0);
  });

  it('should not delete ad if it not exists', async () => {
    const { headers, user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id, { status: 'DRAFT' }));

    const { error } = await testApiCall(
      client.api.ad[':adId'].favorite.$delete({ param: { adId: ad.id } }, { headers }),
    );

    const deletedFavorites = await db
      .select()
      .from(favoriteTable)
      .where(and(eq(favoriteTable.adId, ad.id), eq(favoriteTable.userId, user.id)));

    expect(error).toHaveProperty('status', StatusCode.CONFLICT);
    expect(deletedFavorites).toHaveLength(0);
  });
});
