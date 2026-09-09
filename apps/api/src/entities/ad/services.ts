import * as fs from 'node:fs/promises';
import { AdStatus, MAX_IMAGES_PER_AD } from '@purrfect_match/shared/entities/ad/constants';
import { AdPublishSchema } from '@purrfect_match/shared/entities/ad/schemas';
import type { AdDraftType, AdFilterType, AdPagination } from '@purrfect_match/shared/entities/ad/types';
import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import type { User } from 'better-auth';
import { and, asc, count, desc, eq, exists, like, or, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod/v4-mini';

import { db } from '@/lib/db';
import { MEDIA_ROOT_FOLDER } from '@/models/constants';
import { adImageTable, adTable } from './tables';
import type { AdImageSelectType, AdSelectType } from './types';
import { getAdMediaDir, getAdMediaPath, uploadImage } from './utils';

export async function adFindManyService({
  breed,
  search,
  type,
  userId,
  page = 1,
  sortBy = 'publishedAt',
  orderBy = 'desc',
  limit = 12,
  showPublished = false,
  withoutPagination = false,
}: AdFilterType) {
  const orderByQuery =
    orderBy === 'desc' ? [desc(adTable[sortBy]), desc(adTable.id)] : [asc(adTable[sortBy]), asc(adTable.id)];
  const whereQuery = and(
    search ? like(adTable.description, `%${search}%`) : undefined,
    breed ? eq(adTable.breed, breed) : undefined,
    type ? eq(adTable.type, type) : undefined,
    userId ? eq(adTable.userId, userId) : undefined,
    showPublished
      ? or(eq(adTable.status, AdStatus.PUBLISHED), eq(adTable.status, AdStatus.UNPUBLISHED))
      : eq(adTable.status, AdStatus.PUBLISHED),
  );

  const adsQuery = db.query.adTable.findMany({
    limit,
    offset: (page - 1) * limit,
    with: {
      images: { columns: { blurDataUrl: true, url: true }, limit: 1 },
    },
    columns: {
      id: true,
      breed: true,
      publishedAt: true,
      name: true,
      price: true,
      type: true,
      status: true,
    },
    orderBy: orderByQuery,
    where: whereQuery,
  });

  const paginationQuery = withoutPagination ? [] : db.select({ total: count() }).from(adTable).where(whereQuery);

  const [ads, [totalResult]] = await Promise.all([adsQuery, paginationQuery]);

  const totalItems = totalResult?.total ?? 0;
  const totalPages = Math.ceil(totalItems / limit);

  const pagination: AdPagination = {
    totalItems,
    totalPages,
    currentPage: page,
    pageSize: limit,
    hasNext: page < totalPages,
  };
  return { items: ads, pagination };
}

export async function adFindOneService({ id }: { id: AdSelectType['id'] }) {
  const ad = await db.query.adTable.findFirst({
    where: and(
      eq(adTable.id, id),
      or(eq(adTable.status, AdStatus.PUBLISHED), eq(adTable.status, AdStatus.UNPUBLISHED)),
    ),
    with: { images: true, user: { columns: { name: true } }, profile: true },
  });
  if (!ad) throw new HTTPException(StatusCode.NOT_FOUND, { message: 'Ad not found.' });

  return ad;
}

export async function adDeleteService({ userId, id }: { userId: User['id']; id: AdSelectType['id'] }) {
  return await db.transaction(async (tx) => {
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

export async function adGetDraftService({ userId }: { userId: User['id'] }) {
  const selectedAd = await db.query.adTable.findFirst({
    where: and(eq(adTable.status, AdStatus.DRAFT), eq(adTable.userId, userId)),
    with: { images: true },
    columns: {
      id: true,
      status: true,
      breed: true,
      description: true,
      name: true,
      price: true,
      type: true,
    },
  });

  if (selectedAd) return selectedAd;

  const [createdAd] = await db
    .insert(adTable)
    .values({ breed: '', description: '', name: '', price: 0, type: '', userId, status: AdStatus.DRAFT })
    .returning({
      id: adTable.id,
      status: adTable.status,
      breed: adTable.breed,
      description: adTable.description,
      name: adTable.name,
      price: adTable.price,
      type: adTable.type,
    });

  if (!createdAd) {
    throw new HTTPException(StatusCode.SERVER_ERROR, {
      message: 'Failed to create the draft of an ad. Try again later.',
    });
  }

  return { ...createdAd, images: [] };
}

export async function adUpdateDraftService({ userId, input }: { userId: User['id']; input: Partial<AdDraftType> }) {
  if (Object.keys(input).length === 0) {
    throw new HTTPException(StatusCode.CLIENT_ERROR, {
      message: 'Nothing to update.',
    });
  }

  const [updatedAd] = await db
    .update(adTable)
    .set({
      breed: input.breed,
      name: input.name,
      description: input.description,
      price: input.price,
      type: input.type,
    })
    .where(and(eq(adTable.status, AdStatus.DRAFT), eq(adTable.userId, userId)))
    .returning({ id: adTable.id });

  if (!updatedAd) {
    throw new HTTPException(StatusCode.NOT_FOUND, {
      message: 'Failed to update the draft of an ad. Ad not found. Try again later.',
    });
  }

  return updatedAd;
}

export async function adUploadImageDraftService({ userId, image }: { userId: User['id']; image: File }) {
  return db.transaction(async (tx) => {
    const [selectedAd] = await tx
      .select()
      .from(adTable)
      .where(and(eq(adTable.status, AdStatus.DRAFT), eq(adTable.userId, userId)));

    if (!selectedAd) {
      throw new HTTPException(StatusCode.NOT_FOUND, {
        message: 'Failed to upload image. The draft of an ad not found. Try again later.',
      });
    }

    const { data: uploadedImage, error: uploadError } = await uploadImage({ image, userId, adId: selectedAd.id });
    if (uploadError) {
      throw new HTTPException(StatusCode.SERVER_ERROR, {
        message: uploadError.message,
      });
    }

    const deletePath = getAdMediaPath({
      root: MEDIA_ROOT_FOLDER,
      userId,
      adId: selectedAd.id,
      fileName: uploadedImage.id,
    });

    const [insertedAdImage] = await tx.insert(adImageTable).values(uploadedImage).returning({ id: adTable.id });

    if (!insertedAdImage) {
      await fs.rm(deletePath, { force: true, recursive: true });
      throw new HTTPException(StatusCode.SERVER_ERROR, {
        message: 'Failed to upload image. Try again later.',
      });
    }

    const imageCountSelect = await tx
      .select({ count: count() })
      .from(adImageTable)
      .where(eq(adImageTable.adId, selectedAd.id));
    const imageCount = imageCountSelect[0]?.count || 0;

    if (imageCount > MAX_IMAGES_PER_AD) {
      await fs.rm(deletePath, { force: true, recursive: true });
      throw new HTTPException(StatusCode.CLIENT_ERROR, {
        message: `Uploaded too many images. Max allowed is ${MAX_IMAGES_PER_AD}`,
      });
    }

    return uploadedImage;
  });
}

export async function adDeleteImageDraftService({
  userId,
  adImageId,
}: {
  userId: User['id'];
  adImageId: AdImageSelectType['id'];
}) {
  return db.transaction(async (tx) => {
    const toDeleteAd = tx
      .select()
      .from(adTable)
      .where(and(eq(adTable.status, AdStatus.DRAFT), eq(adTable.userId, userId)));

    const [deletedAd] = await tx
      .delete(adImageTable)
      .where(and(eq(adImageTable.id, adImageId), exists(toDeleteAd)))
      .returning({ id: adImageTable.id, adId: adImageTable.adId });

    if (!deletedAd) {
      throw new HTTPException(StatusCode.NOT_FOUND, {
        message: 'Failed to delete image. The image not found. Try again later.',
      });
    }

    try {
      const deletePath = getAdMediaPath({
        root: MEDIA_ROOT_FOLDER,
        userId,
        adId: deletedAd.adId,
        fileName: deletedAd.id,
      });
      await fs.rm(deletePath);
    } catch (error) {
      throw new HTTPException(StatusCode.SERVER_ERROR, {
        message: 'Failed to delete draft image. Try again later.',
        cause: error,
      });
    }
    return deletedAd;
  });
}

export async function adPublishDraftService({ userId }: { userId: User['id'] }) {
  const toPublishAd = await db.query.adTable.findFirst({
    where: and(eq(adTable.status, AdStatus.DRAFT), eq(adTable.userId, userId)),
    with: { images: true },
  });

  if (!toPublishAd) {
    throw new HTTPException(StatusCode.NOT_FOUND, { message: 'Failed to publish. The draft of an ad not found.' });
  }

  const { success, error } = await AdPublishSchema.safeParseAsync(toPublishAd);
  if (!success) {
    throw new HTTPException(StatusCode.CLIENT_ERROR, { message: z.prettifyError(error) });
  }

  const [publishedAd] = await db
    .update(adTable)
    .set({ status: AdStatus.UNPUBLISHED, publishedAt: new Date().toISOString() })
    .where(eq(adTable.id, toPublishAd.id))
    .returning({ id: adTable.id });

  if (!publishedAd) {
    throw new HTTPException(StatusCode.SERVER_ERROR, {
      message: 'Failed to publish the draft of an ad. Try again later.',
    });
  }

  return publishedAd;
}

export async function adTogglePublishService({ userId, id }: { userId: User['id']; id: AdSelectType['id'] }) {
  const [updatedAd] = await db
    .update(adTable)
    .set({
      status: sql`CASE
        WHEN ${eq(adTable.status, AdStatus.PUBLISHED)} THEN '${sql.raw(AdStatus.UNPUBLISHED)}'
        WHEN ${eq(adTable.status, AdStatus.UNPUBLISHED)} THEN '${sql.raw(AdStatus.PUBLISHED)}'
        ELSE ${adTable.status}
      END`,
    })
    .where(and(eq(adTable.userId, userId), eq(adTable.id, id)))
    .returning({ id: adTable.id, status: adTable.status });

  if (!updatedAd) {
    throw new HTTPException(StatusCode.SERVER_ERROR, { message: 'Failed to toggle publish status. Try again later.' });
  }

  return updatedAd;
}
