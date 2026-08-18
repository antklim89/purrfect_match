import { z } from 'zod/v4-mini';

import { ADS_SORT_BY, MAX_ADS_LIMIT } from './config';
import { ContactArraySchema } from '../contact/schema';

export const AdCreateSchema = z.object({
  name: z.string().check(z.minLength(2), z.maxLength(500)),
  type: z.string().check(z.minLength(2), z.maxLength(500)),
  price: z.number().check(z.minimum(0), z.maximum(9000000)),
  description: z.string().check(z.minLength(10), z.maxLength(40000)),
  breed: z.string().check(z.minLength(2), z.maxLength(500)),
  contacts: ContactArraySchema,
  isPublished: z.boolean(),
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
