import type { z } from 'zod/v4-mini';

import type { SignInSchema, SignUpSchema } from './schemas';

export type SignInType = z.infer<typeof SignInSchema>;
export type SignUpType = z.infer<typeof SignUpSchema>;
