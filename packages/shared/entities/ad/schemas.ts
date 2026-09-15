import { z } from 'zod/v4-mini';

import { ADS_SORT_BY, MAX_ADS_LIMIT, MAX_IMAGES_PER_AD } from './constants';
import { animalBreeds, animalTypes } from '../animal/constants';

export const AdImageSchema = z.object({
  id: z.uuid(),
  url: z.string(),
  blurDataUrl: z.string(),
});

export const AdPublishSchema = z
  .object({
    name: z.string().check(z.minLength(2), z.maxLength(500)),
    type: z.enum(animalTypes, 'Unknown animal type.'),
    price: z.number().check(z.minimum(0), z.maximum(9000000)),
    description: z.string().check(z.minLength(10), z.maxLength(40000)),
    breed: z.string(),
    images: z
      .array(AdImageSchema)
      .check(
        z.minLength(1, 'Add at least one image.'),
        z.maxLength(MAX_IMAGES_PER_AD, `Max allowed images is ${MAX_IMAGES_PER_AD}`),
      ),
  })
  .check(z.refine((v) => animalBreeds[v.type].includes(v.breed), { path: ['breed'], error: 'Unknown animal breed.' }));

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
  minPrice: z.optional(z.coerce.number().check(z.minimum(0))),
  maxPrice: z.optional(z.coerce.number().check(z.minimum(0))),
  status: z.optional(z.enum(['all', 'published', 'unpublished'])),
  userId: z.optional(z.string()),
  page: z.optional(z.coerce.number().check(z.positive())),
  sortBy: z.optional(z.literal(ADS_SORT_BY)),
  orderBy: z.optional(z.enum(['asc', 'desc'])),
  limit: z.optional(z.coerce.number().check(z.positive(), z.maximum(MAX_ADS_LIMIT))),
  withoutPagination: z.optional(z.coerce.boolean()),
});
