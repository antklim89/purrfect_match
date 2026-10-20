import { cache } from 'react';
import type { InferRequestType } from 'hono/client';

import { apiCall, apiClient, apiSessionClient } from '@/shared/lib/api-client';
import { adDraftDto, adDto, adListDto } from '@/shared/model/dto/ad';

export const adFindOneQuery = cache(async ({ id }: { id: string }) => {
  return await apiCall(apiClient.api.ad[':adId'].$get({ param: { adId: id } }), adDto);
});

export const adFindListQuery = cache(async ({ query }: InferRequestType<typeof apiClient.api.ad.$get>) => {
  return await apiCall(apiSessionClient.api.ad.$get({ query }), adListDto);
});

export const adFindNewListQuery = cache(async () => {
  return await apiCall(
    apiSessionClient.api.ad.$get({ query: { limit: '6', sortBy: 'publishedAt', orderBy: 'desc' } }),
    adListDto,
  );
});

export const adFavoritesListQuery = cache(async () => {
  return await apiCall(
    apiSessionClient.api.ad.$get({ query: { limit: '20', sortBy: 'publishedAt', favorites: 'true', orderBy: 'desc' } }),
    adListDto,
  );
});

export const adFindDraftQuery = cache(async () => {
  return await apiCall(apiSessionClient.api.ad['get-draft'].$post(), adDraftDto);
});

export const adFindMyListQuery = cache(async ({ userId }: { userId: string }) => {
  return await apiCall(
    apiSessionClient.api.ad.$get({
      query: { authorId: userId, limit: '50', sortBy: 'publishedAt', orderBy: 'desc', status: 'all' },
    }),
    adListDto,
  );
});
