import type { profileTable } from '@purrfect_match/api/auth/tables';
import type { z } from 'zod/v4-mini';

import type { ProfileUpdateSchema } from './schema';

export type ProfileUpdateType = z.infer<typeof ProfileUpdateSchema>;

export type ProfileType = typeof profileTable.$inferSelect;
