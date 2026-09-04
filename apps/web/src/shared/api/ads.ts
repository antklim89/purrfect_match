import { cache } from 'react';
import type { InferRequestType } from 'hono/client';

import { apiCall, apiClient, apiSessionClient } from '@/shared/lib/api-client';

export const getAds = cache(async ({ query }: InferRequestType<typeof apiClient.api.ad.$get>) => {
  return await apiCall(apiClient.api.ad.$get({ query }));
});

export const getNewAds = cache(async () => {
  return await apiCall(apiClient.api.ad.$get({ query: { limit: '6', sortBy: 'createdAt', orderBy: 'desc' } }));
});

export const getAd = cache(async ({ id }: { id: string }) => {
  return await apiCall(apiClient.api.ad[':id'].$get({ param: { id } }));
});

export const getMyAd = cache(async ({ id }: { id: string }) => {
  return await apiCall(apiSessionClient.api.ad[':id'].$get({ param: { id } }));
});

export const getMyAds = cache(async ({ userId }: { userId: string }) => {
  return await apiCall(
    apiSessionClient.api.ad.$get({
      query: { userId, limit: '50', sortBy: 'createdAt', orderBy: 'desc', showPublished: 'true' },
    }),
  );
});

export const getDraftAd = cache(async () => {
  return await apiCall(apiSessionClient.api.ad['get-draft'].$post());
});

export const publishDraftAd = cache(async () => {
  return await apiCall(apiClient.api.ad['publish-draft'].$patch({}));
});

export const updateDraftAd = cache(
  async ({ json }: InferRequestType<(typeof apiClient.api.ad)['update-draft']['$patch']>) => {
    return await apiCall(apiClient.api.ad['update-draft'].$patch({ json }));
  },
);

export const uploadImageDraftAd = cache(async ({ image }: { image: File }) => {
  return await apiCall(apiClient.api.ad['upload-image-draft'].$patch({ form: { image } }));
});

export const deleteImageDraftAd = cache(async ({ adId }: { adId: string }) => {
  return await apiCall(apiClient.api.ad[':id']['delete-image-draft'].$patch({ param: { id: adId } }));
});

export const togglePublishAd = cache(async ({ adId }: { adId: string }) => {
  return await apiCall(apiClient.api.ad[':id']['toggle-publish'].$patch({ param: { id: adId } }));
});

export const deleteAd = cache(async ({ adId }: { adId: string }) => {
  return await apiCall(apiClient.api.ad[':id'].$delete({ param: { id: adId } }));
});
