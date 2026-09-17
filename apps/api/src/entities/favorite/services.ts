import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import type { User } from 'better-auth';
import { and, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { db } from '@/lib/db';
import { favoriteTable } from './tables';
import type { AdSelectType } from '../ad/types';

export async function deleteFavoriteService({ userId, adId }: { userId: User['id']; adId: AdSelectType['id'] }) {
  return await db.transaction(async (tx) => {
    const [deletedFavorite] = await tx
      .delete(favoriteTable)
      .where(and(eq(favoriteTable.adId, adId), eq(favoriteTable.userId, userId)))
      .returning({ adId: favoriteTable.adId });

    if (!deletedFavorite) throw new HTTPException(StatusCode.CONFLICT, { message: 'Ad is not in favorites.' });

    return null;
  });
}

export async function insertFavoriteService({ userId, adId }: { userId: User['id']; adId: AdSelectType['id'] }) {
  return await db.transaction(async (tx) => {
    const [insertedFavorite] = await tx
      .insert(favoriteTable)
      .values({ adId, userId })
      .onConflictDoNothing()
      .returning({ adId: favoriteTable.adId });

    if (!insertedFavorite) throw new HTTPException(StatusCode.CONFLICT, { message: 'Ad already in favorites.' });

    return null;
  });
}
