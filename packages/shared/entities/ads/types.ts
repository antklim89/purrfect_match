import type { z } from 'zod/v4-mini';

import type { AdCreateSchema, AdFilterSchema } from './schemas';

export type AdCreateType = z.infer<typeof AdCreateSchema>;
export type AdFilterType = z.infer<typeof AdFilterSchema>;
