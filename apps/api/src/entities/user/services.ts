import type { UserUpdateType } from '@purrfect_match/shared/entities/user/types';
import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userTable } from './tables';

export async function userProfileUpdateService({ headers, input }: { headers: HeadersInit; input: UserUpdateType }) {
  await auth.api.updateUser({
    body: {
      address: input.address,
      contacts: input.contacts,
      description: input.description,
      fullName: input.fullName,
      name: input.name,
    },
    headers,
  });

  return null;
}

export async function userProfileGetService({ userId }: { userId: string }) {
  const profile = await db.query.userTable.findFirst({
    where: eq(userTable.id, userId),
    columns: {
      address: true,
      contacts: true,
      fullName: true,
      description: true,
      name: true,
      image: true,
    },
  });

  if (!profile) throw new HTTPException(StatusCode.NOT_FOUND, { message: 'User not found.' });

  return profile;
}
