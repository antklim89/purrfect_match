import type { z } from 'zod/v4-mini';

import type { ProfileUpdateSchema, SignInSchema, SignUpSchema } from './schemas';
import type { ContactType } from '../contact/types';

export type ProfileUpdateType = z.infer<typeof ProfileUpdateSchema>;
export type SignInType = z.infer<typeof SignInSchema>;
export type SignUpType = z.infer<typeof SignUpSchema>;

export interface ProfileType {
  contacts: ContactType[] | null;
  description: string | null;
  fullName: string | null;
  address: string | null;
  id: string;
  updatedAt: string;
  tel: string[] | null;
}
