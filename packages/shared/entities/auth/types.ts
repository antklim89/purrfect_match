import type { profileTable } from '@purrfect_match/api/auth/tables';
import type { z } from 'zod/v4-mini';

import type { ProfileUpdateSchema, UserMessengerSchema } from './schema';

export type UserMessengerType = z.infer<typeof UserMessengerSchema>;
export type ProfileUpdateType = z.infer<typeof ProfileUpdateSchema>;

export type ProfileType = typeof profileTable.$inferSelect;
