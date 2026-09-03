import * as fs from 'node:fs/promises';
import { ADS_SORT_BY, AdStatus, MAX_IMAGES_PER_AD } from '@purrfect_match/shared/entities/ad/constants';
import type { User } from 'better-auth';
import { eq } from 'drizzle-orm';
import { testClient } from 'hono/testing';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import app from '@/app';
import { MEDIA_ROOT_FOLDER } from '@/lib/constants';
import { testApiCall } from '@/test/api-call';
import { adTable } from './tables';
import type { AdSelectType } from './types';
import { getAdMediaDir, getAdMediaPath } from './utils';
import { db } from '../lib/db';
import { insertData, insertListData, registerTestUser } from '../test/insert-data';
import { createTestAdData } from '../test/test-data';

const client = testClient(app);

const image = new File([await Bun.file('./src/test/images/placeholder-1.jpg').arrayBuffer()], 'file1.jpg');

beforeAll(async () => {
  await fs.rm(MEDIA_ROOT_FOLDER, { force: true, recursive: true });
});

describe('[DELETE] /api/ad/:id', () => {
  it('should delete ad', async () => {
    const { headers, user } = await registerTestUser();

    const imageId = Bun.randomUUIDv7();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const mediaDir = getAdMediaDir({ root: MEDIA_ROOT_FOLDER, adId: ad.id, userId: user.id });
    const mediaPath = getAdMediaPath({ root: MEDIA_ROOT_FOLDER, adId: ad.id, userId: user.id, fileName: imageId });

    await Bun.write(mediaPath, image);

    await testApiCall(client.api.ad[':id'].$delete({ param: { id: ad.id } }, { headers }));

    const deletedAd = await db.query.adTable.findFirst({ where: eq(adTable.id, ad.id) });

    expect(deletedAd).toBeUndefined();
    expect(await fs.exists(mediaDir)).toBeFalsy();
    expect(await fs.exists(mediaPath)).toBeFalsy();
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

describe('[GET] /api/ad', () => {
  let user: User;

  beforeEach(async () => {
    user = (await registerTestUser()).user;
  });

  it('should find ads', async () => {
    const insertedAd = await Promise.all([
      insertData(adTable, createTestAdData(user.id, { status: AdStatus.PUBLISHED })),
      insertData(adTable, createTestAdData(user.id, { status: AdStatus.UNPUBLISHED })),
      insertData(adTable, createTestAdData(user.id, { status: AdStatus.DRAFT })),
    ]);

    const { data } = await testApiCall(client.api.ad.$get({ query: { limit: '50' } }));

    expect(data!.items).toHaveLength(2);

    expect(data!.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: insertedAd[0].id }),
        expect.objectContaining({ id: insertedAd[1].id }),
      ]),
    );
  });

  it('should find all ads with search', async () => {
    const search = 'foo';
    const insertedAd = await Promise.all([
      insertData(adTable, createTestAdData(user.id, { description: 'foo bar' })),
      insertData(adTable, createTestAdData(user.id, { description: 'baz foo' })),
      insertData(adTable, createTestAdData(user.id, { description: 'bar baz' })),
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
    const insertedAd = await Promise.all([
      insertData(adTable, createTestAdData(user.id, { type: 'cat' })),
      insertData(adTable, createTestAdData(user.id, { type: 'cat' })),
      insertData(adTable, createTestAdData(user.id, { type: 'dog' })),
    ]);

    const { data } = await testApiCall(client.api.ad.$get({ query: { type, limit: '50' } }));

    expect(data!.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: insertedAd[0].id }),
        expect.objectContaining({ id: insertedAd[1].id }),
      ]),
    );
  });

  it('should find all ads with filtered breed', async () => {
    const breed = 'red';
    const insertedAd = await Promise.all([
      insertData(adTable, createTestAdData(user.id, { breed: 'red' })),
      insertData(adTable, createTestAdData(user.id, { breed: 'red' })),
      insertData(adTable, createTestAdData(user.id, { breed: 'blue' })),
    ]);

    const { data } = await testApiCall(client.api.ad.$get({ query: { breed, limit: '50' } }));

    expect(data!.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: insertedAd[0].id }),
        expect.objectContaining({ id: insertedAd[1].id }),
      ]),
    );
  });

  it.each((['desc', 'asc'] as const).flatMap((orderBy) => ADS_SORT_BY.flatMap((sortBy) => ({ orderBy, sortBy }))))(
    'should find all ads with sort $sortBy and order $orderBy',
    async ({ orderBy, sortBy }) => {
      const insertedAds = await insertListData(adTable, () => createTestAdData(user.id), 35);
      let nextCursor: { cursorId: string; cursor: string | number } | null | undefined;
      const totalAds: Partial<AdSelectType>[] = [];

      while (true) {
        const { data, error } = await testApiCall(
          client.api.ad.$get({
            query: { sortBy, orderBy, limit: '10', cursor: nextCursor?.cursor, cursorId: nextCursor?.cursorId },
          }),
        );
        if (error) return expect(error).toBeNull();

        nextCursor = data?.nextCursor;
        totalAds.push(...data.items);
        if (!data?.nextCursor) break;
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
});

describe('[GET] /api/ad/:id', () => {
  it('should find ad', async () => {
    const { user } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id));
    const { data, error } = await testApiCall(client.api.ad[':id'].$get({ param: { id: ad.id } }));
    if (error) return expect(error).toBeNull();

    expect(data.id).toEqual(ad.id);
  });

  it('should not find draft ad', async () => {
    const { user, headers } = await registerTestUser();
    const ad = await insertData(adTable, createTestAdData(user.id, { status: AdStatus.DRAFT }));
    const { error } = await testApiCall(client.api.ad[':id'].$get({ param: { id: ad.id } }, { headers }));

    expect(error).toHaveProperty('status', 404);
  });
});

describe('[POST] /api/ad/get-draft', () => {
  it('should get or create draft ad', async () => {
    const { headers } = await registerTestUser();
    const { headers: headersAnother } = await registerTestUser();
    const { data: firstData } = await testApiCall(client.api.ad['get-draft'].$post({}, { headers }));

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
    const { user, headers } = await registerTestUser();
    const insertedAd = await insertData(adTable, createTestAdData(user.id, { status: 'DRAFT' }));
    await testApiCall(
      client.api.ad['update-draft'].$patch(
        {
          json: {
            breed: 'UPDATED',
            description: 'UPDATED',
            name: 'UPDATED',
            price: 1000,
            type: 'UPDATED',
          },
        },
        { headers },
      ),
    );

    const [updatedAd] = await db.select().from(adTable).where(eq(adTable.id, insertedAd.id));

    expect(updatedAd).toHaveProperty('breed', 'UPDATED');
    expect(updatedAd).toHaveProperty('description', 'UPDATED');
    expect(updatedAd).toHaveProperty('name', 'UPDATED');
    expect(updatedAd).toHaveProperty('breed', 'UPDATED');
    expect(updatedAd).toHaveProperty('price', 1000);
    expect(updatedAd).toHaveProperty('type', 'UPDATED');
    expect(updatedAd).toHaveProperty('status', AdStatus.DRAFT);
  });

  it('should not update status column', async () => {
    const { user, headers } = await registerTestUser();
    const insertedAd = await insertData(adTable, createTestAdData(user.id, { status: 'DRAFT' }));
    await testApiCall(
      client.api.ad['update-draft'].$patch(
        {
          json: {
            // @ts-expect-error testing
            status: AdStatus.PUBLISHED,
          },
        },
        { headers },
      ),
    );

    const [updatedAd] = await db.select().from(adTable).where(eq(adTable.id, insertedAd.id));
    expect(updatedAd).toHaveProperty('status', AdStatus.DRAFT);
  });
});

describe('[PATCH] /api/ad/upload-image-draft', () => {
  it('should upload draft ad image', async () => {
    const { user, headers } = await registerTestUser();
    const draftAd = await insertData(adTable, createTestAdData(user.id, { status: 'DRAFT' }));

    await testApiCall(client.api.ad['upload-image-draft'].$patch({ form: { image } }, { headers }));

    const updatedAd = await db.query.adTable.findFirst({
      where: eq(adTable.id, draftAd.id),
      with: { images: true },
    });

    const uploadedImageExists = await fs.exists(
      getAdMediaPath({
        root: MEDIA_ROOT_FOLDER,
        adId: updatedAd!.id,
        userId: user.id,
        fileName: updatedAd!.images[0]!.id,
      }),
    );
    expect(uploadedImageExists).toBeTruthy();
    expect(updatedAd?.images).toHaveLength(1);
  });

  it('should not upload too many images', async () => {
    const { user, headers } = await registerTestUser();
    const draftAd = await insertData(adTable, createTestAdData(user.id, { status: 'DRAFT' }));

    await Promise.all(
      Array.from({ length: MAX_IMAGES_PER_AD }, () =>
        testApiCall(client.api.ad['upload-image-draft'].$patch({ form: { image } }, { headers })),
      ),
    );

    const { error } = await testApiCall(client.api.ad['upload-image-draft'].$patch({ form: { image } }, { headers }));
    expect(error).not.toBeNullable();
    const updatedAd = await db.query.adTable.findFirst({
      where: eq(adTable.id, draftAd.id),
      with: { images: true },
    });

    const imagesDir = getAdMediaDir({
      root: MEDIA_ROOT_FOLDER,
      adId: updatedAd!.id,
      userId: user.id,
    });
    const dir = await Array.fromAsync(fs.glob(`${imagesDir}/**/*`));

    expect(dir).toHaveLength(MAX_IMAGES_PER_AD);
    expect(updatedAd?.images).toHaveLength(MAX_IMAGES_PER_AD);
  });
});

describe('[PATCH] /api/ad/:id/delete-image-draft', () => {
  it('should delete draft ad image', async () => {
    const { user, headers } = await registerTestUser();
    await insertData(adTable, createTestAdData(user.id, { status: 'DRAFT' }));

    const { data: uploadedImage } = await testApiCall(
      client.api.ad['upload-image-draft'].$patch({ form: { image } }, { headers }),
    );

    const { data: deletedImage } = await testApiCall(
      client.api.ad[':id']['delete-image-draft'].$patch({ param: { id: uploadedImage!.id } }, { headers }),
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
    const { user, headers } = await registerTestUser();
    const draftAd = await insertData(adTable, createTestAdData(user.id, { status: 'DRAFT' }));

    await testApiCall(client.api.ad['upload-image-draft'].$patch({ form: { image } }, { headers }));

    const { data: publishedAd } = await testApiCall(client.api.ad['publish-draft'].$patch({}, { headers }));
    const [selectedAd] = await db.select().from(adTable).where(eq(adTable.id, draftAd.id));

    expect(selectedAd).toHaveProperty('status', AdStatus.UNPUBLISHED);
    expect(selectedAd).toHaveProperty('publishedAt');
    expect(publishedAd).toHaveProperty('id', draftAd.id);
  });

  it('should not publish not draft ad', async () => {
    const { user, headers } = await registerTestUser();
    await insertData(adTable, createTestAdData(user.id, { status: 'PUBLISHED' }));

    await testApiCall(client.api.ad['upload-image-draft'].$patch({ form: { image } }, { headers }));

    const { data: publishedAd, error } = await testApiCall(client.api.ad['publish-draft'].$patch({}, { headers }));

    expect(publishedAd).toBeNullable();
    expect(error).not.toBeNullable();
  });

  it('should not publish invalid draft ad', async () => {
    const { user, headers } = await registerTestUser();
    const draftAd = await insertData(
      adTable,
      createTestAdData(user.id, {
        status: AdStatus.DRAFT,
        price: -1,
        description: 'A',
        name: 'X',
        breed: 'Y',
        type: 'Z',
      }),
    );

    const { data: publishedAd, error } = await testApiCall(client.api.ad['publish-draft'].$patch({}, { headers }));
    const [selectedAd] = await db.select().from(adTable).where(eq(adTable.id, draftAd.id));

    expect(selectedAd).toHaveProperty('status', AdStatus.DRAFT);
    expect(publishedAd).toBeNullable();
    expect(error).not.toBeNullable();
  });
});

describe('[PATCH] /api/ad/:id/toggle-publish', () => {
  it('should toggle publish status', async () => {
    const { user, headers } = await registerTestUser();
    const draftAd = await insertData(adTable, createTestAdData(user.id, { status: AdStatus.PUBLISHED }));

    const { data: ad1, error: error1 } = await testApiCall(
      client.api.ad[':id']['toggle-publish'].$patch({ param: { id: draftAd.id } }, { headers }),
    );

    expect(error1).toBeNullable();
    expect(ad1).toHaveProperty('id', draftAd.id);
    expect(ad1).toHaveProperty('status', AdStatus.UNPUBLISHED);

    const { data: ad2, error: error2 } = await testApiCall(
      client.api.ad[':id']['toggle-publish'].$patch({ param: { id: draftAd.id } }, { headers }),
    );

    expect(error2).toBeNullable();
    expect(ad2).toHaveProperty('id', draftAd.id);
    expect(ad2).toHaveProperty('status', AdStatus.PUBLISHED);
  });
});
