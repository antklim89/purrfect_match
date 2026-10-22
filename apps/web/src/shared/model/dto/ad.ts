import type { AdDraftType, AdPagination, AdPreviewType, AdType } from '@purrfect_match/shared/entities/ad/types';
import type { InferResponseType } from 'hono/client';

import type { apiClient, apiSessionClient } from '@/shared/lib/api-client';

export const adDto = (data: InferResponseType<(typeof apiClient.api.ad)[':adId']['$get']>): AdType => {
  return {
    ...data,
    type: data.breed.animalTypeName,
    breed: data.breed.name,
  };
};

export const adDraftDto = (
  data: InferResponseType<(typeof apiSessionClient.api.ad)['get-draft']['$post']>,
): AdDraftType => {
  return {
    ...data,
    breedName: 'breedName' in data ? data.breedName : data.breed.name,
    images: 'images' in data ? data.images : undefined,
  };
};

export const adListDto = (
  data: InferResponseType<(typeof apiClient.api.ad)['$get']>,
): { pagination: AdPagination; items: AdPreviewType[] } => {
  return {
    pagination: data.pagination,
    items: data.items.map((item) => ({
      ...item,
      type: item.breed.animalTypeName,
      breed: item.breed.name,
    })),
  };
};
