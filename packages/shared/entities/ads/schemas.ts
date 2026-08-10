import { z } from 'zod/v4-mini';

import { ADS_SORT_BY, adConfig, MAX_ADS_LIMIT } from './config';

export const AdCreateSchema = z.object({
  name: z.string().check(z.minLength(adConfig.name.min), z.maxLength(adConfig.name.max)),
  type: z.string().check(z.minLength(adConfig.type.min), z.maxLength(adConfig.type.max)),
  price: z.coerce.number<number>().check(z.minimum(adConfig.price.min), z.maximum(adConfig.price.max)),
  description: z.string().check(z.minLength(adConfig.description.min), z.maxLength(adConfig.description.max)),
  breed: z.string().check(z.minLength(adConfig.breed.min), z.maxLength(adConfig.breed.max)),
  isPublished: z.coerce.boolean<boolean>(),
  images: z.pipe(
    z.transform<File[]>(v => (Array.isArray(v) ? v : [v])),
    z.array(z.file()).check(z.minLength(1), z.maxLength(10)),
  ),
});

export const AdFilterSchema = z.object({
  search: z.optional(z.string().check(z.maxLength(adConfig.search.max))),
  type: z.optional(z.string().check(z.maxLength(adConfig.type.max))),
  breed: z.optional(z.string().check(z.maxLength(adConfig.breed.max))),
  userId: z.optional(z.string()),
  page: z.optional(z.coerce.number().check(z.positive())),
  sortBy: z.optional(z.literal(ADS_SORT_BY)),
  orderBy: z.optional(z.enum(['asc', 'desc'])),
  cursor: z.optional(z.union([z.string(), z.number()])),
  cursorId: z.optional(z.string()),
  limit: z.optional(z.coerce.number().check(z.positive(), z.maximum(MAX_ADS_LIMIT))),
});
