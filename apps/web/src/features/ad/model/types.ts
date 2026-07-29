import type { User } from 'better-auth';

import type { AdImageSelectType, AdSelectType } from '@/shared/types/api-generated/ad/types';

export type AdPreviewType = Pick<AdSelectType, 'id' | 'name' | 'breed' | 'type' | 'price' | 'createdAt'> & {
  images: Pick<AdImageSelectType, 'url' | 'blurDataUrl'>[];
};

export type AdType = AdSelectType & {
  images: Pick<AdImageSelectType, 'id' | 'url' | 'blurDataUrl'>[];
  user: Pick<User, 'name'>;
};
