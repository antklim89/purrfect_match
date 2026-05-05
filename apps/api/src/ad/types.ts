import type z4 from 'zod/v4';

import type { CreateAdSchema } from './validator';

export type CreateAdType = z4.infer<typeof CreateAdSchema>;
