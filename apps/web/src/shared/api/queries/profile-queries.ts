import { cache } from 'react';

import { apiCall, apiSessionClient } from '@/shared/lib/api-client';

export const profileFindQuery = cache(async () => {
  return await apiCall(apiSessionClient.api.profile['get-profile'].$get());
});
