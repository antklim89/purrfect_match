/** biome-ignore-all lint/performance/noAwaitInLoops: testing */

import { eq } from 'drizzle-orm';
import { testClient } from 'hono/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { ADS_SORT_BY } from './constants';
import { adTable } from './tables';
import type { AdSelectType } from './types';
import { db } from '../lib/db';
import { insertData, insertListData, registerTestUser } from '../test/insert-data';
import { createTestAdData } from '../test/test-data';

const client = testClient(app);

const file1 = await Bun.file('./src/test/images/placeholder-1.jpg').arrayBuffer();

function createTestAdForm() {
  return {
    name: 'Coco',
    type: 'Parrot',
    breed: 'Cockatoo',
    description: 'A nice parrot.',
    images: [new File([file1], 'file1.jpg')],
    price: '499.99',
  };
}

describe('[DELETE] /api/ad/:id', () => {
  it('should delete ad', async () => {
    const { headers, user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const response = await client.api.ad[':id'].$delete({ param: { id: ad.id } }, { headers });
    const { error } = await response.json();
    if (error) return expect(error).toBeNull();
    const deletedAd = await db.query.adTable.findFirst({ where: eq(adTable.id, ad.id) });
    expect(deletedAd).toBeUndefined();
  });

  it('should not delete ad if not authenticated', async () => {
    const { user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const response = await client.api.ad[':id'].$delete({ param: { id: ad.id } });

    const { error, result } = await response.json();
    if (!error) return expect(result).toBeNull();

    const deletedAd = await db.query.adTable.findFirst({ where: eq(adTable.id, ad.id) });
    expect(deletedAd).not.toBeUndefined();
    expect(error.type).toEqual('authentication');
  });

  it('should not delete ad if not valid input', async () => {
    const { headers, user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const response = await client.api.ad[':id'].$delete({ param: { id: 'invalid_id' } }, { headers });

    const { error, result } = await response.json();
    if (!error) return expect(result).toBeNull();

    const deletedAd = await db.query.adTable.findFirst({ where: eq(adTable.id, ad.id) });
    expect(deletedAd).not.toBeUndefined();
    expect(error.type).toEqual('validation');
  });

  it('should not delete ad if user id from another user', async () => {
    const { user } = await registerTestUser();
    const { headers } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const response = await client.api.ad[':id'].$delete({ param: { id: ad.id } }, { headers });

    const { error, result } = await response.json();
    if (!error) return expect(result).toBeNull();

    const deletedAd = await db.query.adTable.findFirst({ where: eq(adTable.id, ad.id) });
    expect(deletedAd).not.toBeUndefined();
  });
});

describe('[POST] /api/ad', () => {
  it('should create ad', async () => {
    const { headers, user } = await registerTestUser();
    const testAdForm = createTestAdForm();
    const response = await client.api.ad.$post({ form: testAdForm }, { headers });
    const { error, result } = await response.json();
    if (error) return expect(error).toBeNull();

    const createdAd = await db.query.adTable.findFirst({ where: eq(adTable.id, result.id), with: { images: true } });

    expect(createdAd).toHaveProperty('id');
    expect(createdAd).toHaveProperty('name', testAdForm.name);
    expect(createdAd).toHaveProperty('description', testAdForm.description);
    expect(createdAd).toHaveProperty('breed', testAdForm.breed);
    expect(createdAd).toHaveProperty('type', testAdForm.type);
    expect(createdAd).toHaveProperty('price', 499.99);
    expect(createdAd).toHaveProperty('createdAt');
    expect(createdAd).toHaveProperty('userId', user.id);
    expect(createdAd).toHaveProperty('images');
    expect(createdAd?.images).toHaveLength(1);
  });

  it('should not create ad if not authenticated', async () => {
    const testAdForm = createTestAdForm();
    const response = await client.api.ad.$post({ form: testAdForm });

    const { error, result } = await response.json();
    if (result) return expect(result).toBeNull();

    expect(error.type).toEqual('authentication');
  });

  it('should not create ad if not valid input', async () => {
    const { headers } = await registerTestUser();
    const testAdForm = createTestAdForm();
    // @ts-expect-error
    delete testAdForm.breed;
    const response = await client.api.ad.$post({ form: testAdForm }, { headers });

    const { error, result } = await response.json();
    if (result) return expect(result).toBeNull();

    expect(error.type).toEqual('validation');
  });

  it('should not create ad without images', async () => {
    const { headers } = await registerTestUser();
    const testAdForm = createTestAdForm();
    testAdForm.images = [];
    const response = await client.api.ad.$post({ form: testAdForm }, { headers });

    const { error, result } = await response.json();
    if (result) return expect(result).toBeNull();

    expect(error.type).toEqual('validation');
  });
});

describe('[GET] /api/ad', () => {
  let ads: AdSelectType[];
  beforeEach(async () => {
    const { user } = await registerTestUser();
    ads = await insertListData(adTable, () => createTestAdData(user.id), 30);
  });

  it('should find only published ads ads', async () => {
    const response = await client.api.ad.$get({ query: { limit: '50' } });
    const { error, result } = await response.json();
    if (error) return expect(error).toBeNull();

    expect(result.data).toHaveLength(12);
    expect(result.data.every(i => i.isPublished)).toBeTruthy();
  });

  it('should find all ads with search', async () => {
    const search = 'foo';
    const response = await client.api.ad.$get({ query: { search, limit: '50' } });
    const { error, result } = await response.json();
    if (error) return expect(error).toBeNull();

    expect(result.data).toHaveLength(8);
    expect(result.data.every(i => i.description.includes(search))).toBeTruthy();
  });

  it('should find all ads with filtered type', async () => {
    const type = 'cat';
    const response = await client.api.ad.$get({ query: { type, limit: '50' } });
    const { error, result } = await response.json();
    if (error) return expect(error).toBeNull();

    expect(result.data).toHaveLength(2);
    expect(result.data.every(i => i.type.includes(type))).toBeTruthy();
  });

  it('should find all ads with filtered breed', async () => {
    const breed = 'red';
    const response = await client.api.ad.$get({ query: { breed, limit: '50' } });
    const { error, result } = await response.json();
    if (error) return expect(error).toBeNull();

    expect(result.data).toHaveLength(4);
    expect(result.data.every(i => i.breed.includes(breed))).toBeTruthy();
  });

  it('should find published and not published ads if filtered by authorId', async () => {
    const { user, headers } = await registerTestUser();
    await insertData(adTable, createTestAdData(user.id, { isPublished: true }));
    await insertData(adTable, createTestAdData(user.id, { isPublished: false }));
    const response = await client.api.ad.$get({ query: { userId: user.id } }, { headers });
    const { error, result } = await response.json();
    if (error) return expect(error).toBeNull();

    expect(result.data[0]?.isPublished).toBeTruthy();
    expect(result.data[1]?.isPublished).toBeFalsy();
  });

  it.each(
    (['desc', 'asc'] as const).flatMap(orderBy => ADS_SORT_BY.flatMap(sortBy => ({ orderBy, sortBy }))),
  )('should find all ads with sort $sortBy and order $orderBy', async ({ orderBy, sortBy }) => {
    let nextCursor: { cursorId: string; cursor: string | number } | null | undefined;
    const totalAds: AdSelectType[] = [];

    const allAds = ads
      .filter(i => i.isPublished)
      .map(i => i[sortBy])
      .sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') return a - b;
        if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b);
        return 1;
      });
    if (orderBy === 'desc') allAds.reverse();

    for (let index = 0; index < 3; index++) {
      const response = await client.api.ad.$get({
        query: { sortBy, orderBy, limit: '5', cursor: nextCursor?.cursor, cursorId: nextCursor?.cursorId },
      });
      const { error, result } = await response.json();
      if (error) return expect(error).toBeNull();

      nextCursor = result?.nextCursor;
      totalAds.push(...result.data);
    }

    expect(totalAds.map(i => i[sortBy]).every((i, idx) => i === allAds[idx])).toBeTruthy();
    expect(totalAds).toHaveLength(12);
    expect([...new Set(totalAds.map(i => i.id))]).toHaveLength(12);
  });
});

describe('[GET] /api/ad/:id', () => {
  it('should find ad', async () => {
    const { user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const response = await client.api.ad[':id'].$get({ param: { id: ad.id } });
    const { error, result } = await response.json();
    if (error) return expect(error).toBeNull();

    expect(result.id).toEqual(ad.id);
  });
});

describe('[PATCH] /api/ad/:id/publish', () => {
  it('should toggle isPublish', async () => {
    const { user, headers } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));

    for (let index = 0; index < 5; index++) {
      const response = await client.api.ad[':id'].publish.$patch({ param: { id: ad.id } }, { headers });
      const { error, result } = await response.json();
      if (error) return expect(error).toBeNull();

      expect(result.isPublished === (index % 2 === 0)).toBeTruthy();
    }
  });

  it('should not toggle isPublished if not authenticated', async () => {
    const { user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const response = await client.api.ad[':id'].publish.$patch({ param: { id: ad.id } });

    const { error, result } = await response.json();
    if (result) return expect(result).toBeNull();

    expect(error.type).toEqual('authentication');
  });
});
