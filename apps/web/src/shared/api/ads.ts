import { cache } from 'react';
import type { AdCreateType } from '@purrfect_match/shared/entities/ad/types';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

import { apiCall, apiClient } from '@/shared/lib/api-client';

export const getNewAds = cache(async () => {
  return await apiCall(apiClient.api.ad.$get({ query: { limit: '6', sortBy: 'createdAt', orderBy: 'desc' } }));
});

export const getAd = cache(async ({ id }: { id: string }) => {
  return await apiCall(apiClient.api.ad[':id'].$get({ param: { id } }));
});

export const getMyAds = cache(async ({ userId, headers }: { userId: string; headers: ReadonlyHeaders }) => {
  return await apiCall(
    apiClient.api.ad.$get(
      { query: { userId, limit: '50', sortBy: 'createdAt', orderBy: 'desc' } },
      { headers: Object.fromEntries(headers.entries()) },
    ),
  );
});

export const createAd = cache(async ({ input, images }: { input: AdCreateType; images: File[] }) => {
  return await apiCall(apiClient.api.ad.$post({ form: { input: JSON.stringify(input), images } }));
});

export const deleteAd = cache(async ({ adId }: { adId: string }) => {
  return await apiCall(apiClient.api.ad[':id'].$delete({ param: { id: adId } }));
});

export const publishAd = cache(async ({ adId }: { adId: string }) => {
  return await apiCall(apiClient.api.ad[':id'].publish.$patch({ param: { id: adId } }));
});
