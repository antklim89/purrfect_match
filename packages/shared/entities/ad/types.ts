import type { z } from 'zod/v4-mini';

import type { AdStatus } from './constants';
import type { AdDraftSchema, AdFilterSchema } from './schemas';
import type { ProfileType } from '../profile/types';

export type AdDraftType = z.infer<typeof AdDraftSchema>;
export type AdFilterType = z.infer<typeof AdFilterSchema>;

export interface AdImageType {
  id: string;
  url: string;
  blurDataUrl: string;
}

export interface AdPreviewType {
  name: string;
  type: string;
  price: number;
  breed: string;
  status: AdStatus;
  createdAt: string;
  id: string;
  images: {
    url: string;
    blurDataUrl: string;
  }[];
}

export interface AdType {
  name: string;
  type: string;
  price: number;
  description: string;
  breed: string;
  status: AdStatus;
  userId: string;
  createdAt: string;
  id: string;
  images: AdImageType[];
  profile: ProfileType;
  user: {
    name: string;
  };
}
