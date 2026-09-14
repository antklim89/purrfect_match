import type { z } from 'zod/v4-mini';

import type { AdStatus } from './constants';
import type { AdDraftSchema, AdFilterSchema } from './schemas';
import type { UserContactType } from '../auth/types';

export type AdDraftType = z.infer<typeof AdDraftSchema>;
export type AdFilterType = z.infer<typeof AdFilterSchema>;

export interface AdImageType {
  id: string;
  url: string;
  blurDataUrl: string;
}

export interface AdPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
}

export interface AdPreviewType {
  name: string;
  type: string;
  price: number;
  breed: string;
  status: AdStatus;
  publishedAt: string;
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
  publishedAt: string;
  id: string;
  images: AdImageType[];
  user: {
    contacts: UserContactType[];
    name: string;
  };
}
