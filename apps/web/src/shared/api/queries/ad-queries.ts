import { cache } from 'react';
import type { InferRequestType } from 'hono/client';

import { apiCall, apiClient, apiSessionClient } from '@/shared/lib/api-client';
import { adDraftDto, adDto, adListDto } from '@/shared/model/dto/ad';

type AdQuery = InferRequestType<typeof apiClient.api.ad.$get>;

export const adFindOneQuery = cache(async ({ id }: { id: string }) => {
  return await apiCall(apiClient.api.ad[':adId'].$get({ param: { adId: id } }), adDto);
});

export const adFindListQuery = cache(async ({ query }: AdQuery) => {
  return await apiCall(apiSessionClient.api.ad.$get({ query }), adListDto);
});

export const adFindNewListQuery = cache(async () => {
  return await apiCall(
    apiSessionClient.api.ad.$get({
      query: { limit: '6', sortBy: 'publishedAt', orderBy: 'desc', withoutPagination: 'true' },
    }),
    adListDto,
  );
});

export const adFavoritesListQuery = cache(
  async ({ query }: { query: Pick<AdQuery['query'], 'page' | 'sortBy' | 'orderBy'> }) => {
    return await apiCall(
      apiSessionClient.api.ad.$get({
        query: { limit: '20', favorites: 'true', sortBy: query.sortBy, orderBy: query.orderBy, page: query.page },
      }),
      adListDto,
    );
  },
);

export const adFindDraftQuery = cache(async () => {
  return await apiCall(apiSessionClient.api.ad['get-draft'].$post(), adDraftDto);
});

export const adFindMyListQuery = cache(
  async ({ userId, query }: { userId: string; query: Pick<AdQuery['query'], 'page' | 'sortBy' | 'orderBy'> }) => {
    return await apiCall(
      apiSessionClient.api.ad.$get({
        query: {
          authorId: userId,
          limit: '20',
          status: 'all',
          sortBy: query.sortBy,
          orderBy: query.orderBy,
          page: query.page,
        },
      }),
      adListDto,
    );
  },
);
