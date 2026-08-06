import type { z } from 'zod/v4-mini';

import type { UserInfoUpdateSchema, UserMessengerSchema } from './schema';

export type UserMessengerType = z.infer<typeof UserMessengerSchema>;
export type UserInfoUpdateType = z.infer<typeof UserInfoUpdateSchema>;

export interface ProfileType {
  messengers?: { messenger: string; number: string }[] | null;
  fullName?: string | null;
  address?: string | null;
  description?: string | null;
  tel?: string[] | null;
}
