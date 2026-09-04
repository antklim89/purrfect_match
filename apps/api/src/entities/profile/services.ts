import type { ProfileUpdateType } from '@purrfect_match/shared/entities/profile/types';
import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import { HTTPException } from 'hono/http-exception';

import { db } from '@/lib/db';
import { profileTable } from './tables';

export async function profileUpdateService({ userId, input }: { userId: string; input: ProfileUpdateType }) {
  await db
    .insert(profileTable)
    .values({ id: userId, ...input })
    .onConflictDoUpdate({ target: profileTable.id, set: input });

  return null;
}

export async function profileGetService({ userId }: { userId: string }) {
  const profile = await db.query.profileTable.findFirst({
    where: (fields, operators) => operators.eq(fields.id, userId),
  });
  if (profile) return profile;

  const [insertedProfile] = await db.insert(profileTable).values({ id: userId }).returning();
  if (!insertedProfile) throw new HTTPException(StatusCode.SERVER_ERROR, { message: 'Failed to get user profile.' });

  return insertedProfile;
}
