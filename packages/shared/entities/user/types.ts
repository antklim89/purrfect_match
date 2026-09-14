import type { z } from 'zod/v4-mini';

import type { UserContactSchema, UserUpdateSchema } from './schemas';

export type UserUpdateType = z.infer<typeof UserUpdateSchema>;
export type UserContactType = z.infer<typeof UserContactSchema>;

export interface UserProfileType {
  name: string;
  description: string;
  image: string | null;
  fullName: string;
  contacts: {
    type: string;
    number: string;
  }[];
  address: string;
}
