import type { User } from 'better-auth';

import { db } from '@/api/lib/db';
import { ad } from './schema';
import type { CreateAdType } from './types';

export async function createAdService({ userId, input }: { userId: User['id']; input: CreateAdType }) {
  const result = await db
    .insert(ad)
    .values({
      category: input.category,
      name: input.name,
      description: input.description,
      type: input.type,
      userId,
    })
    .returning({ id: ad.id });

  return result;
}
