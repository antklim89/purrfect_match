import { cache } from 'react';
import type { InferRequestType } from 'hono/client';

import { apiCall, apiClient, apiSessionClient } from '@/shared/lib/api-client';

export const adFindOneQuery = cache(async ({ id }: { id: string }) => {
  'use cache';
  return await apiCall(apiClient.api.ad[':id'].$get({ param: { id } }));
});

export const adFindListQuery = cache(async ({ query }: InferRequestType<typeof apiClient.api.ad.$get>) => {
  'use cache';
  return await apiCall(apiClient.api.ad.$get({ query }));
});

export const adFindNewListQuery = cache(async () => {
  return await apiCall(apiClient.api.ad.$get({ query: { limit: '6', sortBy: 'createdAt', orderBy: 'desc' } }));
});

export const adFindDraftQuery = cache(async () => {
  return await apiCall(apiSessionClient.api.ad['get-draft'].$post());
});

export const adFindMyListQuery = cache(async ({ userId }: { userId: string }) => {
  return await apiCall(
    apiSessionClient.api.ad.$get({
      query: { userId, limit: '50', sortBy: 'createdAt', orderBy: 'desc', showPublished: 'true' },
    }),
  );
});
