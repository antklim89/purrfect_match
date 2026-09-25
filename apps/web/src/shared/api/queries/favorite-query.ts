import { cache } from 'react';
import type { AdType } from '@purrfect_match/shared/entities/ad/types';

import { apiCall, apiSessionClient } from '@/shared/lib/api-client';

export const toggleFavorite = cache(async ({ adId, inFavorites }: { adId: AdType['id']; inFavorites: boolean }) => {
  return inFavorites
    ? await apiCall(apiSessionClient.api.ad[':adId'].favorite.$delete({ param: { adId } }))
    : await apiCall(apiSessionClient.api.ad[':adId'].favorite.$post({ param: { adId } }));
});
