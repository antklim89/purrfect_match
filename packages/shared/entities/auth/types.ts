import type { z } from 'zod/v4-mini';

import type { UserInfoSchema, UserMessengerSchema } from './schema';

export type UserMessengerType = z.infer<typeof UserMessengerSchema>;
export type UserInfoType = z.infer<typeof UserInfoSchema>;
