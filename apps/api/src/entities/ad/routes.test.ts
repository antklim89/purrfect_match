import * as fs from 'node:fs/promises';
import { faker } from '@faker-js/faker';
import { ADS_SORT_BY, AdStatus, MAX_IMAGES_PER_AD } from '@purrfect_match/shared/entities/ad/constants';
import { eq } from 'drizzle-orm';
import { testClient } from 'hono/testing';
import { beforeAll, describe, expect, it } from 'vitest';

import app from '@/app';
import { db } from '@/lib/db';
import { MEDIA_ROOT_FOLDER } from '@/models/constants';
import { testApiCall } from '@/test/api-call';
import {
  insertAd,
  insertAdImage,
  insertAnimalBreed,
  insertAnimalType,
  insertFavorite,
  registerTestUser,
} from '@/test/insert-data';
import { adTable } from './tables';
import type { AdSelectType } from './types';
import { getAdMediaDir, getAdMediaPath } from './utils';

const client = testClient(app);

const image = new File([await Bun.file('./src/test/images/placeholder-1.jpg').arrayBuffer()], 'file1.jpg');

beforeAll(async () => {
  await fs.rm(MEDIA_ROOT_FOLDER, { force: true, recursive: true });
});

describe('[GET] /api/ad', () => {
  it('should find ads', async () => {
    const [insertedAd1, insertedAd2] = await Promise.all([
      insertAd({ ad: { status: AdStatus.PUBLISHED } }),
      insertAd({ ad: { status: AdStatus.UNPUBLISHED } }),
      insertAd({ ad: { status: AdStatus.DRAFT } }),
    ]);

    await insertFavorite({ ad: insertedAd1, user: insertedAd1.user });

    const { data } = await testApiCall(client.api.ad.$get({ query: { limit: '50' } }));

    expect(data!.items).toHaveLength(1);
    expect(data!.items).toEqual(expect.arrayContaining([expect.objectContaining({ id: insertedAd1.id })]));

    const { data: data2 } = await testApiCall(client.api.ad.$get({ query: { limit: '50', status: 'all' } }));

    expect(data2!.items).toHaveLength(2);
    expect(data2!.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: insertedAd1.id }),
        expect.objectContaining({ id: insertedAd2.id }),
      ]),
    );
  });

  it('should show is ad in favorites', async () => {
    const { user, headers } = await registerTestUser();
    const insertedAd = await Promise.all([insertAd({ user }), insertAd({ user })]);

    await insertFavorite({ ad: insertedAd[0], user });

    const result1 = await testApiCall(client.api.ad.$get({ query: { limit: '50' } }, { headers }));

    expect(result1.data!.items[1]!.inFavorites).toBeTruthy();
    expect(result1.data!.items[0]!.inFavorites).toBeFalsy();

    const result2 = await testApiCall(client.api.ad.$get({ query: { limit: '50' } }));

    expect(result2.data!.items[1]!.inFavorites).toBeFalsy();
    expect(result2.data!.items[0]!.inFavorites).toBeFalsy();
  });

  it('should find favorites ads', async () => {
    const { user, headers } = await registerTestUser();
    const insertedAd = await Promise.all([insertAd({ user }), insertAd({ user })]);

    const insertedFavorite1 = await insertFavorite({ ad: insertedAd[0], user });
    const insertedFavorite2 = await insertFavorite({ ad: insertedAd[1], user });

    const result = await testApiCall(client.api.ad.$get({ query: { limit: '50', favorites: 'true' } }, { headers }));

    expect(result.data!.items).toHaveLength(2);
    expect(result.data!.items[0]!.id).toEqual(insertedFavorite2.adId);
    expect(result.data!.items[1]!.id).toEqual(insertedFavorite1.adId);
  });

  it('should find all ads with search', async () => {
    const search = 'foo';
    const insertedAd = await Promise.all([
      insertAd({ ad: { description: 'foo bar' } }),
      insertAd({ ad: { description: 'baz foo' } }),
      insertAd({ ad: { description: 'bar baz' } }),
    ]);

    const { data } = await testApiCall(client.api.ad.$get({ query: { search, limit: '50' } }));

    expect(data!.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: insertedAd[0].id }),
        expect.objectContaining({ id: insertedAd[1].id }),
      ]),
    );
  });

  it('should find all ads with filtered type', async () => {
    const type = 'cat';

    const typeCat = await insertAnimalType({ type: { name: type } });
    const typeDog = await insertAnimalType({ type: { name: 'dog' } });

    const insertedAd = await Promise.all([
      insertAd({ type: typeCat }),
      insertAd({ type: typeCat }),
      insertAd({ type: typeDog }),
    ]);

    const { data } = await testApiCall(client.api.ad.$get({ query: { type, limit: '50' } }));

    expect(data!.items).toHaveLength(2);
    expect(data!.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: insertedAd[0].id }),
        expect.objectContaining({ id: insertedAd[1].id }),
        expect.not.objectContaining({ id: insertedAd[2].id }),
      ]),
    );
  });

  it('should find all ads with filtered breed', async () => {
    const breed = 'red';
    const breedRed = await insertAnimalBreed({ breed: { name: breed } });
    const breedBlue = await insertAnimalBreed({ breed: { name: 'blue' } });
    const insertedAd = await Promise.all([
      insertAd({ breed: breedRed }),
      insertAd({ breed: breedRed }),
      insertAd({ breed: breedBlue }),
    ]);

    const { data } = await testApiCall(client.api.ad.$get({ query: { breed, limit: '50' } }));

    expect(data!.items).toHaveLength(2);
    expect(data!.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: insertedAd[0].id }),
        expect.objectContaining({ id: insertedAd[1].id }),
        expect.not.objectContaining({ id: insertedAd[2].id }),
      ]),
    );
  });

  it.each([
    { minPrice: '400', type: 'min' },
    { maxPrice: '200', type: 'max' },
    { minPrice: '200', maxPrice: '400', type: 'both' },
  ])('should find ads with $type price filter', async ({ maxPrice, minPrice, type }) => {
    const insertedAd = await Promise.all([
      insertAd({ ad: { price: 100 } }),
      insertAd({ ad: { price: 200 } }),
      insertAd({ ad: { price: 300 } }),
      insertAd({ ad: { price: 400 } }),
      insertAd({ ad: { price: 500 } }),
    ]);

    const { data } = await testApiCall(client.api.ad.$get({ query: { maxPrice, minPrice, limit: '50' } }));

    expect(data!.items).toEqual(
      expect.arrayContaining(
        type === 'min'
          ? [expect.objectContaining({ id: insertedAd[3].id }), expect.objectContaining({ id: insertedAd[4].id })]
          : type === 'max'
            ? [expect.objectContaining({ id: insertedAd[0].id }), expect.objectContaining({ id: insertedAd[1].id })]
            : type === 'all'
              ? [
                  expect.objectContaining({ id: insertedAd[1].id }),
                  expect.objectContaining({ id: insertedAd[2].id }),
                  expect.objectContaining({ id: insertedAd[3].id }),
                ]
              : [],
      ),
    );
  });

  it.each([
    { youngerThan: '2000-10-04', type: 'min' },
    { olderThan: '2000-10-02', type: 'max' },
    { youngerThan: '2000-10-02', olderThan: '2000-10-04', type: 'both' },
  ])('should find ads with $type birth filter', async ({ olderThan, youngerThan, type }) => {
    const insertedAd = await Promise.all([
      insertAd({ ad: { birth: '2000-10-01' } }),
      insertAd({ ad: { birth: '2000-10-02' } }),
      insertAd({ ad: { birth: '2000-10-03' } }),
      insertAd({ ad: { birth: '2000-10-04' } }),
      insertAd({ ad: { birth: '2000-10-05' } }),
    ]);

    const { data } = await testApiCall(client.api.ad.$get({ query: { olderThan, youngerThan, limit: '50' } }));

    expect(data!.items).toEqual(
      expect.arrayContaining(
        type === 'min'
          ? [expect.objectContaining({ id: insertedAd[3].id }), expect.objectContaining({ id: insertedAd[4].id })]
          : type === 'max'
            ? [expect.objectContaining({ id: insertedAd[0].id }), expect.objectContaining({ id: insertedAd[1].id })]
            : type === 'all'
              ? [
                  expect.objectContaining({ id: insertedAd[1].id }),
                  expect.objectContaining({ id: insertedAd[2].id }),
                  expect.objectContaining({ id: insertedAd[3].id }),
                ]
              : [],
      ),
    );
  });

  it.each((['desc', 'asc'] as const).flatMap((orderBy) => ADS_SORT_BY.flatMap((sortBy) => ({ orderBy, sortBy }))))(
    'should find all ads with sort $sortBy and order $orderBy',
    async ({ orderBy, sortBy }) => {
      const insertedAds = await Promise.all(faker.helpers.multiple(() => insertAd(), { count: 35 }));

      let page: string | undefined;

      const totalAds: Partial<AdSelectType>[] = [];

      while (true) {
        const { data, error } = await testApiCall(
          client.api.ad.$get({
            query: { sortBy, orderBy, limit: '10', page },
          }),
        );
        if (error) return expect(error).toBeNull();

        totalAds.push(...data.items);
        if (data.pagination.currentPage >= data.pagination.totalPages) break;
        page = String(data.pagination.currentPage + 1);
      }

      const allAds = insertedAds
        .map((i) => i[sortBy])
        .sort((a, b) => {
          if (typeof a === 'number' && typeof b === 'number') return a - b;
          if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b);
          return 1;
        });
      if (orderBy === 'desc') allAds.reverse();

      expect(totalAds.every((i, index) => i[sortBy] === allAds[index])).toBeTruthy();
      expect(totalAds).toHaveLength(35);
    },
  );

  it('should find search with pagination', async () => {
    const typeCat = await insertAnimalType({ type: { name: 'cat' } });
    const typeDog = await insertAnimalType({ type: { name: 'dog' } });
    await Promise.all([
      insertAd({ ad: { description: 'foo bar baz' }, type: typeDog }),
      insertAd({ ad: { description: 'bar baz' }, type: typeDog }),
      insertAd({ ad: { description: 'foo bar baz' }, type: typeCat }),
      insertAd({ ad: { description: 'bar baz' }, type: typeCat }),
      insertAd({ ad: { description: 'foo bar baz' }, type: typeCat }),
      insertAd({ ad: { description: 'foo bar baz' }, type: typeCat }),
    ]);

    const result1 = await testApiCall(
      client.api.ad.$get({ query: { search: 'foo', sortBy: 'publishedAt', limit: '2' } }),
    );
    expect(result1.data?.pagination).toMatchObject({
      totalItems: 4,
      totalPages: 2,
      currentPage: 1,
    });

    const result2 = await testApiCall(
      client.api.ad.$get({ query: { type: 'cat', sortBy: 'publishedAt', limit: '2', page: '2' } }),
    );

    expect(result2.data?.pagination).toMatchObject({
      totalItems: 4,
      totalPages: 2,
      currentPage: 2,
    });
  });
});

describe('[GET] /api/ad/:id', () => {
  it('should find ad', async () => {
    const ad = await insertAd();
    const { data, error } = await testApiCall(client.api.ad[':adId'].$get({ param: { adId: ad.id } }));
    if (error) return expect(error).toBeNull();

    expect(data.id).toEqual(ad.id);
  });

  it('should find ad with favorites', async () => {
    const { user, headers } = await registerTestUser();
    const ad = await insertAd();
    const ad2 = await insertAd();
    await insertFavorite({ ad, user });

    const result1 = await testApiCall(client.api.ad[':adId'].$get({ param: { adId: ad.id } }, { headers }));
    expect(result1.data!.id).toEqual(ad.id);

    const result2 = await testApiCall(client.api.ad[':adId'].$get({ param: { adId: ad.id } }));
    expect(result2.data!.inFavorites).toBeFalsy();

    const result3 = await testApiCall(client.api.ad[':adId'].$get({ param: { adId: ad2.id } }));
    expect(result3.data!.inFavorites).toBeFalsy();
  });

  it('should not find draft ad', async () => {
    const ad = await insertAd({ ad: { status: AdStatus.DRAFT } });
    const { error } = await testApiCall(
      client.api.ad[':adId'].$get({ param: { adId: ad.id } }, { headers: ad.headers }),
    );

    expect(error).toHaveProperty('status', 404);
  });
});

describe('[POST] /api/ad/get-draft', () => {
  it('should get or create draft ad', async () => {
    const { headers } = await registerTestUser();
    const { headers: headersAnother } = await registerTestUser();
    await insertAnimalBreed();
    const { data: firstData } = await testApiCall(client.api.ad['get-draft'].$post({}, { headers }));

    expect(firstData).toStrictEqual({
      id: expect.anything(),
      name: '',
      description: '',
      birth: expect.anything(),
      gender: 'male',
      tsvector: '',
      price: 0,
      status: 'DRAFT',
      breedName: expect.anything(),
      userId: expect.anything(),
      createdAt: expect.anything(),
      publishedAt: expect.anything(),
    });
    expect(firstData).toHaveProperty('id');
    expect(firstData).toHaveProperty('status', AdStatus.DRAFT);

    const { data: secondData } = await testApiCall(client.api.ad['get-draft'].$post({}, { headers }));
    expect(secondData).toHaveProperty('id', firstData!.id);
    expect(secondData).toHaveProperty('status', AdStatus.DRAFT);

    const { data: anotherUserData } = await testApiCall(
      client.api.ad['get-draft'].$post({}, { headers: headersAnother }),
    );
    expect(anotherUserData).toHaveProperty('id');
    expect(anotherUserData).toHaveProperty('status', AdStatus.DRAFT);
    expect(anotherUserData!.id).not.toEqual(firstData!.id);
    expect(anotherUserData!.id).not.toEqual(secondData!.id);
  });
});

describe('[PATCH] /api/ad/update-draft', () => {
  it('should update draft ad', async () => {
    const insertedAd = await insertAd({ ad: { status: 'DRAFT' } });
    const breedUpdated = await insertAnimalBreed({ breed: { name: 'UPDATED' } });
    await testApiCall(
      client.api.ad['update-draft'].$patch(
        {
          json: {
            birth: '2020-01-02',
            gender: 'female',
            breedName: breedUpdated.name,
            description: 'UPDATED',
            name: 'UPDATED',
            price: 1000,
          },
        },
        { headers: insertedAd.headers },
      ),
    );

    const [updatedAd] = await db.select().from(adTable).where(eq(adTable.id, insertedAd.id));

    expect(updatedAd).toHaveProperty('birth', '2020-01-02');
    expect(updatedAd).toHaveProperty('gender', 'female');
    expect(updatedAd).toHaveProperty('breedName', 'UPDATED');
    expect(updatedAd).toHaveProperty('description', 'UPDATED');
    expect(updatedAd).toHaveProperty('name', 'UPDATED');
    expect(updatedAd).toHaveProperty('price', 1000);
    expect(updatedAd).toHaveProperty('status', AdStatus.DRAFT);
  });

  it('should not update status column', async () => {
    const insertedAd = await insertAd({ ad: { status: AdStatus.DRAFT } });
    await testApiCall(
      client.api.ad['update-draft'].$patch(
        // @ts-expect-error testing
        { json: { status: AdStatus.PUBLISHED } },
        { headers: insertedAd.headers },
      ),
    );

    const [updatedAd] = await db.select().from(adTable).where(eq(adTable.id, insertedAd.id));
    expect(updatedAd).toHaveProperty('status', AdStatus.DRAFT);
  });
});

describe('[PATCH] /api/ad/upload-image-draft', () => {
  it('should upload draft ad image', async () => {
    const draftAd = await insertAd({ ad: { status: 'DRAFT' } });

    await testApiCall(client.api.ad['upload-image-draft'].$patch({ form: { image } }, { headers: draftAd.headers }));

    const updatedAd = await db.query.adTable.findFirst({
      where: { id: draftAd.id },
      with: { images: true },
    });

    const uploadedImageExists = await fs.exists(
      getAdMediaPath({
        root: MEDIA_ROOT_FOLDER,
        adId: updatedAd!.id,
        userId: draftAd.user.id,
        fileName: updatedAd!.images[0]!.id,
      }),
    );
    expect(uploadedImageExists).toBeTruthy();
    expect(updatedAd?.images).toHaveLength(1);
  });

  it('should not upload too many images', async () => {
    const draftAd = await insertAd({ ad: { status: 'DRAFT' } });

    await Promise.all(
      Array.from({ length: MAX_IMAGES_PER_AD }, () =>
        testApiCall(client.api.ad['upload-image-draft'].$patch({ form: { image } }, { headers: draftAd.headers })),
      ),
    );

    const { error } = await testApiCall(
      client.api.ad['upload-image-draft'].$patch({ form: { image } }, { headers: draftAd.headers }),
    );
    expect(error).not.toBeNullable();
    const updatedAd = await db.query.adTable.findFirst({
      where: { id: draftAd.id },
      with: { images: true },
    });

    const imagesDir = getAdMediaDir({
      root: MEDIA_ROOT_FOLDER,
      adId: updatedAd!.id,
      userId: draftAd.user.id,
    });
    const dir = await Array.fromAsync(fs.glob(`${imagesDir}/**/*`));

    expect(dir).toHaveLength(MAX_IMAGES_PER_AD);
    expect(updatedAd?.images).toHaveLength(MAX_IMAGES_PER_AD);
  });
});

describe('[PATCH] /api/ad/:id/delete-image-draft', () => {
  it('should delete draft ad image', async () => {
    const { headers, user, ...insertedAd } = await insertAd({ ad: { status: 'DRAFT' } });
    const { id } = await insertAdImage({ ad: insertedAd });

    const { data: deletedImage } = await testApiCall(
      client.api.ad[':adImageId']['delete-image-draft'].$patch({ param: { adImageId: id } }, { headers }),
    );

    const deletedImageExists = await fs.exists(
      getAdMediaPath({
        root: MEDIA_ROOT_FOLDER,
        adId: deletedImage!.adId,
        userId: user.id,
        fileName: deletedImage!.id,
      }),
    );

    expect(deletedImageExists).toBeFalsy();
    expect(deletedImage).not.toBeNullable();
  });
});

describe('[PATCH] /api/ad/publish-draft', () => {
  it('should publish draft', async () => {
    const { headers, user, ...draftAd } = await insertAd({ ad: { status: 'DRAFT' } });
    await insertAdImage({ ad: draftAd });
    // await testApiCall(client.api.ad['upload-image-draft'].$patch({ form: { image } }, { headers }));

    const { data: publishedAd } = await testApiCall(client.api.ad['publish-draft'].$patch({}, { headers }));
    const [selectedAd] = await db.select().from(adTable).where(eq(adTable.id, draftAd.id));

    expect(selectedAd).toHaveProperty('status', AdStatus.UNPUBLISHED);
    expect(selectedAd).toHaveProperty('publishedAt');
    expect(publishedAd).toHaveProperty('id', draftAd.id);
  });

  it('should not publish not draft ad', async () => {
    const { headers, ...draftAd } = await insertAd();
    await insertAdImage({ ad: draftAd });

    const { data: publishedAd, error } = await testApiCall(client.api.ad['publish-draft'].$patch({}, { headers }));

    expect(publishedAd).toBeNullable();
    expect(error).not.toBeNullable();
  });

  it('should not publish invalid draft ad', async () => {
    const { headers, ...draftAd } = await insertAd({
      ad: {
        status: AdStatus.DRAFT,
        price: -1,
        description: 'A',
        name: 'X',
      },
    });

    const { data: publishedAd, error } = await testApiCall(client.api.ad['publish-draft'].$patch({}, { headers }));
    const [selectedAd] = await db.select().from(adTable).where(eq(adTable.id, draftAd.id));

    expect(selectedAd).toHaveProperty('status', AdStatus.DRAFT);
    expect(publishedAd).toBeNullable();
    expect(error).not.toBeNullable();
  });
});

describe('[PATCH] /api/ad/:id/toggle-publish', () => {
  it('should toggle publish status', async () => {
    const { headers, ...draftAd } = await insertAd();

    const { data: ad1, error: error1 } = await testApiCall(
      client.api.ad[':adId']['toggle-publish'].$patch({ param: { adId: draftAd.id } }, { headers }),
    );

    expect(error1).toBeNullable();
    expect(ad1).toHaveProperty('id', draftAd.id);
    expect(ad1).toHaveProperty('status', AdStatus.UNPUBLISHED);

    const { data: ad2, error: error2 } = await testApiCall(
      client.api.ad[':adId']['toggle-publish'].$patch({ param: { adId: draftAd.id } }, { headers }),
    );

    expect(error2).toBeNullable();
    expect(ad2).toHaveProperty('id', draftAd.id);
    expect(ad2).toHaveProperty('status', AdStatus.PUBLISHED);
  });
});

describe('[DELETE] /api/ad/:id', () => {
  it('should delete ad', async () => {
    const { headers, user, ...ad } = await insertAd();

    const imageId = Bun.randomUUIDv7();
    const mediaDir = getAdMediaDir({ root: MEDIA_ROOT_FOLDER, adId: ad.id, userId: user.id });
    const mediaPath = getAdMediaPath({ root: MEDIA_ROOT_FOLDER, adId: ad.id, userId: user.id, fileName: imageId });

    await Bun.write(mediaPath, image);

    await testApiCall(client.api.ad[':adId'].$delete({ param: { adId: ad.id } }, { headers }));

    const deletedAd = await db.query.adTable.findFirst({ where: { id: ad.id } });

    expect(deletedAd).toBeUndefined();
    expect(await fs.exists(mediaDir)).toBeFalsy();
    expect(await fs.exists(mediaPath)).toBeFalsy();
  });

  it('should not delete ad if not authenticated', async () => {
    const { headers, user, ...ad } = await insertAd();
    const { data, error } = await testApiCall(client.api.ad[':adId'].$delete({ param: { adId: ad.id } }));

    if (!error) return expect(data).toBeNull();

    const deletedAd = await db.query.adTable.findFirst({ where: { id: ad.id } });
    expect(deletedAd).not.toBeUndefined();
    expect(error.status).toEqual(401);
  });

  it('should not delete ad if not valid input', async () => {
    const { headers, user, ...ad } = await insertAd();
    const { data, error } = await testApiCall(
      client.api.ad[':adId'].$delete({ param: { adId: 'invalid_id' } }, { headers }),
    );

    if (!error) return expect(data).toBeNull();

    const deletedAd = await db.query.adTable.findFirst({ where: { id: ad.id } });
    expect(deletedAd).not.toBeUndefined();
    expect(error.status).toEqual(400);
  });

  it('should not delete ad if user id from another user', async () => {
    const { headers } = await registerTestUser();
    const { user, ...ad } = await insertAd();
    const { data, error } = await testApiCall(client.api.ad[':adId'].$delete({ param: { adId: ad.id } }, { headers }));

    if (!error) return expect(data).toBeNull();

    const deletedAd = await db.query.adTable.findFirst({ where: { id: ad.id } });
    expect(deletedAd).not.toBeUndefined();
  });
});
