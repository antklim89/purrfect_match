import type { profileTable } from '@purrfect_match/api/auth/tables';
import type { z } from 'zod/v4-mini';

import type { UserInfoUpdateSchema, UserMessengerSchema } from './schema';

export type UserMessengerType = z.infer<typeof UserMessengerSchema>;
export type UserInfoUpdateType = z.infer<typeof UserInfoUpdateSchema>;

export type ProfileType = typeof profileTable.$inferSelect;
