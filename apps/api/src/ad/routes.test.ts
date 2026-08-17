import * as fs from 'node:fs/promises';
import { ADS_SORT_BY } from '@purrfect_match/shared/entities/ad/config';
import type { AdCreateType } from '@purrfect_match/shared/entities/ad/types';
import { eq } from 'drizzle-orm';
import { testClient } from 'hono/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import app from '@/app';
import { MEDIA_ROOT_FOLDER, MEDIA_ROOT_URL } from '@/lib/constants';
import { testApiCall } from '@/test/api-call';
import { adTable } from './tables';
import type { AdSelectType } from './types';
import { getAdMediaDir, getAdMediaPath } from './utils';
import { db } from '../lib/db';
import { insertData, insertListData, registerTestUser } from '../test/insert-data';
import { createTestAdData } from '../test/test-data';

const client = testClient(app);

const images = [new File([await Bun.file('./src/test/images/placeholder-1.jpg').arrayBuffer()], 'file1.jpg')];

const adCreateTestData: AdCreateType = {
  name: 'Coco',
  type: 'Parrot',
  breed: 'Cockatoo',
  description: 'A very nice parrot!!!',
  price: 499.99,
  isPublished: false,
};

beforeAll(async () => {
  await fs.rm(MEDIA_ROOT_FOLDER, { force: true, recursive: true });
});

describe('[DELETE] /api/ad/:id', () => {
  it('should delete ad', async () => {
    const { headers, user } = await registerTestUser();

    const { data: ad } = await testApiCall(
      client.api.ad.$post({ form: { input: JSON.stringify(adCreateTestData), images } }, { headers }),
    );

    await testApiCall(client.api.ad[':id'].$delete({ param: { id: ad!.id } }, { headers }));

    const deletedAd = await db.query.adTable.findFirst({ where: eq(adTable.id, ad!.id) });
    const mediaDir = getAdMediaDir({ root: MEDIA_ROOT_FOLDER, adId: ad!.id, userId: user.id });

    expect(deletedAd).toBeUndefined();
    expect(await fs.exists(mediaDir)).toBeFalsy();
  });

  it('should not delete ad if not authenticated', async () => {
    const { user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const { data, error } = await testApiCall(client.api.ad[':id'].$delete({ param: { id: ad.id } }));

    if (!error) return expect(data).toBeNull();

    const deletedAd = await db.query.adTable.findFirst({ where: eq(adTable.id, ad.id) });
    expect(deletedAd).not.toBeUndefined();
    expect(error.status).toEqual(401);
  });

  it('should not delete ad if not valid input', async () => {
    const { headers, user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const { data, error } = await testApiCall(
      client.api.ad[':id'].$delete({ param: { id: 'invalid_id' } }, { headers }),
    );

    if (!error) return expect(data).toBeNull();

    const deletedAd = await db.query.adTable.findFirst({ where: eq(adTable.id, ad.id) });
    expect(deletedAd).not.toBeUndefined();
    expect(error.status).toEqual(400);
  });

  it('should not delete ad if user id from another user', async () => {
    const { user } = await registerTestUser();
    const { headers } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const { data, error } = await testApiCall(client.api.ad[':id'].$delete({ param: { id: ad.id } }, { headers }));

    if (!error) return expect(data).toBeNull();

    const deletedAd = await db.query.adTable.findFirst({ where: eq(adTable.id, ad.id) });
    expect(deletedAd).not.toBeUndefined();
  });
});

describe('[POST] /api/ad', () => {
  it('should create ad', async () => {
    const { headers, user } = await registerTestUser();

    const { data, error } = await testApiCall(
      client.api.ad.$post({ form: { input: JSON.stringify(adCreateTestData), images } }, { headers }),
    );
    if (error) return expect(error).toBeNull();

    const createdAd = (await db.query.adTable.findFirst({ where: eq(adTable.id, data.id), with: { images: true } }))!;

    expect(createdAd).toHaveProperty('id');
    expect(createdAd).toHaveProperty('name', adCreateTestData.name);
    expect(createdAd).toHaveProperty('description', adCreateTestData.description);
    expect(createdAd).toHaveProperty('breed', adCreateTestData.breed);
    expect(createdAd).toHaveProperty('type', adCreateTestData.type);
    expect(createdAd).toHaveProperty('price', 499.99);
    expect(createdAd).toHaveProperty('createdAt');
    expect(createdAd).toHaveProperty('userId', user.id);
    expect(createdAd).toHaveProperty('images');
    expect(createdAd.images).toHaveLength(1);
    expect(createdAd.images[0]).toHaveProperty(
      'url',
      getAdMediaPath({
        root: MEDIA_ROOT_URL,
        adId: createdAd.id,
        userId: user.id,
        fileName: createdAd!.images[0]!.id,
      }),
    );
  });

  it('should not create ad if not authenticated', async () => {
    const { data, error } = await testApiCall(
      client.api.ad.$post({ form: { input: JSON.stringify(adCreateTestData), images } }),
    );

    if (data) return expect(data).toBeNull();

    expect(error.status).toEqual(401);
  });

  it('should not create ad if not valid input', async () => {
    const { headers } = await registerTestUser();
    const { data, error } = await testApiCall(
      client.api.ad.$post(
        { form: { input: JSON.stringify({ ...adCreateTestData, breed: undefined }), images } },
        { headers },
      ),
    );

    if (data) return expect(data).toBeNull();

    expect(error.status).toEqual(400);
  });

  it('should not create ad without images', async () => {
    const { headers } = await registerTestUser();
    const { data, error } = await testApiCall(
      client.api.ad.$post({ form: { input: JSON.stringify(adCreateTestData), images: [] } }, { headers }),
    );

    if (data) return expect(data).toBeNull();

    expect(error.status).toEqual(400);
  });
});

describe('[GET] /api/ad', () => {
  let ads: AdSelectType[];
  beforeEach(async () => {
    const { user } = await registerTestUser();
    ads = await insertListData(adTable, () => createTestAdData(user.id), 30);
  });

  it('should find only published ads ads', async () => {
    const { data, error } = await testApiCall(client.api.ad.$get({ query: { limit: '50' } }));
    if (error) return expect(error).toBeNull();

    expect(data.data).toHaveLength(12);
    expect(data.data.every(i => ads.find(j => j.id === i.id)!.isPublished)).toBeTruthy();
  });

  it('should find all ads with search', async () => {
    const search = 'foo';
    const { data, error } = await testApiCall(client.api.ad.$get({ query: { search, limit: '50' } }));
    if (error) return expect(error).toBeNull();

    expect(data.data).toHaveLength(8);
    expect(data.data.every(i => ads.find(j => j.id === i.id)!.description.includes(search))).toBeTruthy();
  });

  it('should find all ads with filtered type', async () => {
    const type = 'cat';
    const { data, error } = await testApiCall(client.api.ad.$get({ query: { type, limit: '50' } }));
    if (error) return expect(error).toBeNull();

    expect(data.data).toHaveLength(2);
    expect(data.data.every(i => i.type.includes(type))).toBeTruthy();
  });

  it('should find all ads with filtered breed', async () => {
    const breed = 'red';
    const { data, error } = await testApiCall(client.api.ad.$get({ query: { breed, limit: '50' } }));
    if (error) return expect(error).toBeNull();

    expect(data.data).toHaveLength(4);
    expect(data.data.every(i => i.breed.includes(breed))).toBeTruthy();
  });

  it('should find published and not published ads if filtered by authorId', async () => {
    const { user, headers } = await registerTestUser();
    const ad1 = await insertData(adTable, createTestAdData(user.id, { isPublished: true }));
    const ad2 = await insertData(adTable, createTestAdData(user.id, { isPublished: false }));
    const { data, error } = await testApiCall(client.api.ad.$get({ query: { userId: user.id } }, { headers }));
    if (error) return expect(error).toBeNull();

    expect(ad1.id === data.data[0]?.id && ad1.isPublished).toBeTruthy();
    expect(ad2.id === data.data[1]?.id && ad2.isPublished).toBeFalsy();
  });

  it.each(
    (['desc', 'asc'] as const).flatMap(orderBy => ADS_SORT_BY.flatMap(sortBy => ({ orderBy, sortBy }))),
  )('should find all ads with sort $sortBy and order $orderBy', async ({ orderBy, sortBy }) => {
    let nextCursor: { cursorId: string; cursor: string | number } | null | undefined;
    const totalAds: Partial<AdSelectType>[] = [];

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
      const { data, error } = await testApiCall(
        client.api.ad.$get({
          query: { sortBy, orderBy, limit: '5', cursor: nextCursor?.cursor, cursorId: nextCursor?.cursorId },
        }),
      );
      if (error) return expect(error).toBeNull();

      nextCursor = data?.nextCursor;
      totalAds.push(...data.data);
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
    const { data, error } = await testApiCall(client.api.ad[':id'].$get({ param: { id: ad.id } }));
    if (error) return expect(error).toBeNull();

    expect(data.id).toEqual(ad.id);
  });
});

describe('[PATCH] /api/ad/:id/publish', () => {
  it('should toggle isPublish', async () => {
    const { user, headers } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));

    for (let index = 0; index < 5; index++) {
      const { data, error } = await testApiCall(
        client.api.ad[':id'].publish.$patch({ param: { id: ad.id } }, { headers }),
      );
      if (error) return expect(error).toBeNull();

      expect(data.isPublished === (index % 2 === 0)).toBeTruthy();
    }
  });

  it('should not toggle isPublished if not authenticated', async () => {
    const { user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const { data, error } = await testApiCall(client.api.ad[':id'].publish.$patch({ param: { id: ad.id } }));

    if (data) return expect(data).toBeNull();

    expect(error.status).toEqual(401);
  });
});
