import { cache } from 'react';

import { apiCall, apiClient } from '@/shared/lib/api-client';

export const profileFindQuery = cache(async ({ cookie }: { cookie: string }) => {
  return await apiCall(apiClient.api.profile['get-profile'].$get(undefined, { headers: { cookie } }));
});
