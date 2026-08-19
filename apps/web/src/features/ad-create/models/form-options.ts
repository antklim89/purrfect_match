import { AdCreateSchema } from '@purrfect_match/shared/entities/ad/schemas';
import type { ContactType } from '@purrfect_match/shared/entities/contact/types';
import { ImagesSchema } from '@purrfect_match/shared/lib/schemas';
import { z } from 'zod/v4-mini';

import { createFormOptions } from '@/shared/lib/form';

export const adCreateFormOptions = createFormOptions({
  schema: z.object({ ...AdCreateSchema.shape, images: ImagesSchema }),
  defaultValues: {
    name: '',
    type: '',
    breed: '',
    description: '',
    images: [] as File[],
    isPublished: false,
    contacts: [] as ContactType[],
    price: 0,
  },
});
