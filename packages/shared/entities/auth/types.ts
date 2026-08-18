import type { profileTable } from '@purrfect_match/api/auth/tables';
import type { z } from 'zod/v4-mini';

import type { ProfileUpdateSchema, SignInSchema, SignUpSchema } from './schemas';

export type ProfileUpdateType = z.infer<typeof ProfileUpdateSchema>;
export type SignInType = z.infer<typeof SignInSchema>;
export type SignUpType = z.infer<typeof SignUpSchema>;

export type ProfileType = typeof profileTable.$inferSelect;
