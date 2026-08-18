import type { z } from 'zod/v4-mini';

import type { AdCreateSchema, AdFilterSchema } from './schemas';
import type { ContactType } from '../contact/types';

export type AdCreateType = z.infer<typeof AdCreateSchema>;
export type AdFilterType = z.infer<typeof AdFilterSchema>;

export interface AdPreviewType {
  name: string;
  type: string;
  price: number;
  breed: string;
  isPublished: boolean | null;
  createdAt: string;
  id: string;
  images: {
    url: string;
    blurDataUrl: string;
  }[];
}

export interface AdType {
  contacts: ContactType[] | null;
  name: string;
  type: string;
  price: number;
  description: string;
  breed: string;
  isPublished: boolean | null;
  userId: string;
  createdAt: string;
  id: string;
  images: {
    id: string;
    url: string;
    blurDataUrl: string;
  }[];
  user: {
    name: string;
  };
}
