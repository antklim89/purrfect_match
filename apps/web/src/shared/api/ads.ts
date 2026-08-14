import { cache } from 'react';
import type { AdCreateType } from '@purrfect_match/shared/entities/ad/types';

import { apiCall, apiClient } from '@/shared/lib/api-client';
import type { FormValues } from '@/shared/lib/types';

export const getNewAds = cache(async () => {
  return await apiCall(apiClient.api.ad.$get({ query: { limit: '6', sortBy: 'createdAt', orderBy: 'desc' } }));
});

export const getAd = cache(async ({ id }: { id: string }) => {
  return await apiCall(apiClient.api.ad[':id'].$get({ param: { id } }));
});

export const getMyAds = cache(async ({ userId }: { userId: string }) => {
  return await apiCall(apiClient.api.ad.$get({ query: { userId, limit: '50', sortBy: 'createdAt', orderBy: 'desc' } }));
});

export const createAd = cache(async ({ value }: { value: FormValues<AdCreateType> }) => {
  return await apiCall(
    apiClient.api.ad.$post({
      form: value,
    }),
  );
});

export const deleteAd = cache(async ({ adId }: { adId: string }) => {
  return await apiCall(apiClient.api.ad[':id'].$delete({ param: { id: adId } }));
});

export const publishAd = cache(async ({ adId }: { adId: string }) => {
  return await apiCall(apiClient.api.ad[':id'].publish.$patch({ param: { id: adId } }));
});
