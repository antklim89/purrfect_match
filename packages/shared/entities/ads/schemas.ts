import { z } from 'zod/v4-mini';

import { ADS_SORT_BY, MAX_ADS_LIMIT } from './config';

export const AdCreateSchema = z.object({
  name: z.string().check(z.minLength(2), z.maxLength(500)),
  type: z.string().check(z.minLength(2), z.maxLength(500)),
  price: z.coerce.number<number>().check(z.minimum(0), z.maximum(9000000)),
  description: z.string().check(z.minLength(10), z.maxLength(40000)),
  breed: z.string().check(z.minLength(2), z.maxLength(500)),
  isPublished: z.coerce.boolean<boolean>(),
  images: z.pipe(
    z.transform<File[]>(v => (Array.isArray(v) ? v : [v])),
    z.array(z.file()).check(z.minLength(1), z.maxLength(10)),
  ),
});

export const AdFilterSchema = z.object({
  search: z.optional(z.string().check(z.maxLength(500))),
  type: z.optional(z.string().check(z.maxLength(500))),
  breed: z.optional(z.string().check(z.maxLength(500))),
  userId: z.optional(z.string()),
  page: z.optional(z.coerce.number().check(z.positive())),
  sortBy: z.optional(z.literal(ADS_SORT_BY)),
  orderBy: z.optional(z.enum(['asc', 'desc'])),
  cursor: z.optional(z.union([z.string(), z.number()])),
  cursorId: z.optional(z.string()),
  limit: z.optional(z.coerce.number().check(z.positive(), z.maximum(MAX_ADS_LIMIT))),
});
