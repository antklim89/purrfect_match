import { z } from 'zod/v4-mini';

import { ADS_SORT_BY, MAX_ADS_LIMIT } from './constants';

export const AdImageSchema = z.object({
  id: z.uuid(),
  url: z.string(),
  blurDataUrl: z.string(),
});

export const AdPublishSchema = z.object({
  name: z.string().check(z.minLength(2), z.maxLength(500)),
  type: z.string().check(z.minLength(2), z.maxLength(500)),
  price: z.number().check(z.minimum(0), z.maximum(9000000)),
  description: z.string().check(z.minLength(10), z.maxLength(40000)),
  breed: z.string().check(z.minLength(2), z.maxLength(500)),
  images: z.array(AdImageSchema).check(z.minLength(1), z.maxLength(20)),
});

export const AdDraftSchema = z.partial(
  z.object({
    name: z.string(),
    type: z.string(),
    price: z.number(),
    description: z.string(),
    breed: z.string(),
    images: z.array(AdImageSchema).check(z.maxLength(20)),
  }),
);

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
