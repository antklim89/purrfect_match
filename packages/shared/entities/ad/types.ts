import type { AdImageSelectType, AdSelectType } from '@purrfect_match/api/ad/types';
import type { User } from 'better-auth';
import type { z } from 'zod/v4-mini';

import type { AdCreateSchema, AdFilterSchema } from './schemas';

export type AdCreateType = z.infer<typeof AdCreateSchema>;
export type AdFilterType = z.infer<typeof AdFilterSchema>;

export type AdPreviewType = Pick<AdSelectType, 'id' | 'name' | 'breed' | 'type' | 'price' | 'createdAt'> & {
  images: Pick<AdImageSelectType, 'url' | 'blurDataUrl'>[];
};

export type AdType = AdSelectType & {
  images: Pick<AdImageSelectType, 'id' | 'url' | 'blurDataUrl'>[];
  user: Pick<User, 'name'>;
};
