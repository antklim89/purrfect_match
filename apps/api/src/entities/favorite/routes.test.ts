import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import { and, eq } from 'drizzle-orm';
import { testClient } from 'hono/testing';
import { describe, expect, it } from 'vitest';

import app from '@/app';
import { db } from '@/lib/db';
import { favoriteTable } from '@/schema';
import { testApiCall } from '@/test/api-call';
import { insertAd, insertFavorite, registerTestUser } from '@/test/insert-data';

const client = testClient(app);

describe('[POST] /api/favorite', () => {
  it('should ad favorite', async () => {
    const { headers, user } = await registerTestUser();
    const ad = await insertAd({ ad: { status: 'DRAFT' } });

    await testApiCall(client.api.ad[':adId'].favorite.$post({ param: { adId: ad.id } }, { headers }));

    const [insertedFavorite] = await db
      .select()
      .from(favoriteTable)
      .where(and(eq(favoriteTable.adId, ad.id), eq(favoriteTable.userId, user.id)));

    expect(insertedFavorite).toStrictEqual({ userId: user.id, adId: ad.id });
  });

  it('should not add favorite if already exists', async () => {
    const { ad, headers, user } = await insertFavorite();

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
  it('should delete favorite', async () => {
    const { ad, headers, user } = await insertFavorite();

    await testApiCall(client.api.ad[':adId'].favorite.$delete({ param: { adId: ad.id } }, { headers }));

    const deletedFavorites = await db
      .select()
      .from(favoriteTable)
      .where(and(eq(favoriteTable.adId, ad.id), eq(favoriteTable.userId, user.id)));

    expect(deletedFavorites).length(0);
  });

  it('should not delete ad if it not exists', async () => {
    const { user, headers, ...ad } = await insertAd();

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

describe('[GET] /ad/:adId/favorite', () => {
  it('should find favorite ad', async () => {
    const { ad, headers } = await insertFavorite();

    const { data } = await testApiCall(client.api.ad[':adId'].favorite.$get({ param: { adId: ad.id } }, { headers }));

    expect(data).not.toBeNull();
  });

  it('should not find not existed favorite ad', async () => {
    const { user, headers, ...ad } = await insertAd();

    const { data } = await testApiCall(client.api.ad[':adId'].favorite.$get({ param: { adId: ad.id } }, { headers }));

    expect(data).toBeNull();
  });
});
