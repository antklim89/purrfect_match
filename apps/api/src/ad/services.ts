import * as fs from 'node:fs/promises';
import type { AdCreateType, AdFilterType } from '@purrfect_match/shared/entities/ad/types';
import { StatusCode } from '@purrfect_match/shared/lib/status-codes';
import type { User } from 'better-auth';
import { and, asc, desc, eq, gt, like, lt, not, or } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { MEDIA_ROOT_FOLDER } from '@/lib/constants';
import { db } from '@/lib/db';
import { adImageTable, adTable } from './tables';
import type { AdSelectType } from './types';
import { getAdMediaDir, uploadImages } from './utils';

export async function adCreateService({ userId, input }: { userId: User['id']; input: AdCreateType }) {
  const adId = Bun.randomUUIDv7();

  try {
    return await db.transaction(async tx => {
      const insertedAdPromise = tx
        .insert(adTable)
        .values({
          id: adId,
          breed: input.breed,
          name: input.name,
          description: input.description,
          price: input.price,
          isPublished: input.isPublished,
          type: input.type,
          userId,
        })
        .returning({ id: adTable.id });

      const insertedAdImagesPromise = tx
        .insert(adImageTable)
        .values(await uploadImages({ images: input.images, userId, adId }))
        .returning({ id: adTable.id });

      const [insertedAd] = await insertedAdPromise;
      if (!insertedAd) throw new Error('Failed to insert ad.');

      const insertedAdImages = await insertedAdImagesPromise;
      if (insertedAdImages.length === 0) throw new Error('Failed to insert ad images.');

      return insertedAd;
    });
  } catch (error) {
    await fs.rm(getAdMediaDir({ userId, adId }), { force: true, recursive: true });
    console.error(error);
    throw new HTTPException(StatusCode.SERVER_ERROR, { message: 'Failed to upload images', cause: error });
  }
}

export async function adFindManyService(
  {
    breed,
    search,
    type,
    userId,
    page = 1,
    sortBy = 'createdAt',
    orderBy = 'desc',
    cursorId,
    cursor,
    limit = 12,
  }: AdFilterType,
  authorId?: string,
) {
  const ads = await db.query.adTable.findMany({
    limit: limit + 1,
    offset: (page - 1) * limit,
    with: {
      images: { columns: { blurDataUrl: true, url: true }, limit: 1 },
    },
    columns: {
      id: true,
      breed: true,
      createdAt: true,
      name: true,
      price: true,
      type: true,
      isPublished: true,
    },
    orderBy(fields) {
      const orderFn = orderBy === 'desc' ? desc : asc;
      return [orderFn(fields[sortBy]), orderFn(fields.id)];
    },
    where: fields => {
      const orderFn = orderBy === 'desc' ? lt : gt;

      function cursorPagination() {
        if (!(cursor && cursorId)) return;
        return or(orderFn(fields[sortBy], cursor), and(eq(fields[sortBy], cursor), orderFn(fields.id, cursorId)));
      }

      return and(
        cursorPagination(),
        search ? like(fields.description, `%${search}%`) : undefined,
        breed ? eq(fields.breed, breed) : undefined,
        type ? eq(fields.type, type) : undefined,
        userId ? eq(fields.userId, userId) : undefined,
        authorId == null || userId == null || authorId !== userId ? eq(fields.isPublished, true) : undefined,
      );
    },
  });

  if (ads.length > limit) {
    ads.pop();
    const lastAd = ads.at(-1) as (typeof ads)[number];
    return { data: ads, nextCursor: { cursorId: lastAd.id, cursor: lastAd[sortBy] } };
  }

  return { data: ads, nextCursor: null };
}

export async function adFindOneService({ id }: { id: AdSelectType['id'] }) {
  const ad = await db.query.adTable.findFirst({
    where: eq(adTable.id, id),
    with: { images: { columns: { id: true, blurDataUrl: true, url: true } }, user: true },
  });
  if (!ad) throw new HTTPException(StatusCode.NOT_FOUND, { message: 'Ad not found.' });

  return ad;
}

export async function adDeleteService({ userId, id }: { userId: User['id']; id: AdSelectType['id'] }) {
  return await db.transaction(async tx => {
    await tx.delete(adTable).where(and(eq(adTable.id, id), eq(adTable.userId, userId)));

    const mediaDir = getAdMediaDir({ root: MEDIA_ROOT_FOLDER, adId: id, userId });

    try {
      await fs.rm(mediaDir, { force: true, recursive: true });
    } catch (error) {
      throw new HTTPException(StatusCode.SERVER_ERROR, { message: 'Failed to delete ad.', cause: error });
    }

    return null;
  });
}

export async function adPublishService({ userId, id }: { userId: User['id']; id: AdSelectType['id'] }) {
  const [result] = await db
    .update(adTable)
    .set({ isPublished: not(adTable.isPublished) })
    .where(and(eq(adTable.id, id), eq(adTable.userId, userId)))
    .returning({ id: adTable.id, isPublished: adTable.isPublished });
  if (!result) throw new HTTPException(StatusCode.NOT_FOUND, { message: 'Ad not updated.' });

  return result;
}
