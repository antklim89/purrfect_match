import type { z } from 'zod/v4-mini';

import type { ProfileContactSchema, ProfileUpdateSchema } from './schemas';

export type ProfileUpdateType = z.infer<typeof ProfileUpdateSchema>;
export type ProfileContactType = z.infer<typeof ProfileContactSchema>;

export interface ProfileType {
  contacts: ProfileContactType[] | null;
  description: string | null;
  fullName: string | null;
  address: string | null;
  id: string;
  updatedAt: string;
}
