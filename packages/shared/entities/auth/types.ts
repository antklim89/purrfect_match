import type { z } from 'zod/v4-mini';

import type { SignInSchema, SignUpSchema, UserContactSchema, UserProfileUpdateSchema } from './schemas';

export type SignInType = z.infer<typeof SignInSchema>;
export type SignUpType = z.infer<typeof SignUpSchema>;

export type UserProfileUpdateType = z.infer<typeof UserProfileUpdateSchema>;
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
