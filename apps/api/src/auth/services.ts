import type { UserInfoUpdateType } from '@purrfect_match/shared/entities/auth/types';
import { errUnexpected, ok } from '@purrfect_match/shared/lib/result';

import { db } from '@/lib/db';
import { profileTable } from './tables';

export async function profileUpdateService({ userId, input }: { userId: string; input: UserInfoUpdateType }) {
  await db
    .insert(profileTable)
    .values({ id: userId, ...input })
    .onConflictDoUpdate({ target: profileTable.id, set: input });

  return ok(null);
}

export async function profileGetService({ userId }: { userId: string }) {
  const profile = await db.query.profileTable.findFirst({
    where: (fields, operators) => operators.eq(fields.id, userId),
  });
  if (profile) return ok(profile);

  const [insertedProfile] = await db.insert(profileTable).values({ id: userId }).returning();
  if (!insertedProfile) return errUnexpected('Failed to get user profile.');

  return ok(insertedProfile);
}
