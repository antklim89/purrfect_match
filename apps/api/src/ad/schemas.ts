import { z } from 'zod/v4-mini';

import { ADS_SORT_BY, MAX_ADS_LIMIT } from './constants';

export const AdCreateSchema = z.object({
  name: z.string().check(z.maxLength(200)),
  type: z.string().check(z.maxLength(200)),
  price: z.coerce.number().check(z.minimum(0), z.maximum(1000000)),
  description: z.string().check(z.maxLength(4000)),
  breed: z.string().check(z.maxLength(200)),
  isPublished: z.optional(z.boolean()),
  images: z.pipe(
    z.union([z.file(), z.array(z.file()).check(z.minLength(1), z.maxLength(10))]),
    z.transform(v => (Array.isArray(v) ? v : [v])),
  ),
});

export const AdFilterSchema = z.object({
  search: z.optional(z.string().check(z.maxLength(200))),
  type: z.optional(z.string().check(z.maxLength(200))),
  breed: z.optional(z.string().check(z.maxLength(200))),
  userId: z.optional(z.string()),
  page: z.optional(z.coerce.number().check(z.positive())),
  sortBy: z.optional(z.literal(ADS_SORT_BY)),
  orderBy: z.optional(z.enum(['asc', 'desc'])),
  cursor: z.optional(z.union([z.string(), z.number()])),
  cursorId: z.optional(z.string()),
  limit: z.optional(z.coerce.number().check(z.positive(), z.maximum(MAX_ADS_LIMIT))),
});
