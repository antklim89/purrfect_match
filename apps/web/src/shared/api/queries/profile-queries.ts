import { cache } from 'react';

import { apiCall, apiSessionClient } from '@/shared/lib/api-client';

export const profileFindQuery = cache(async ({ userId }: { userId: string }) => {
  return await apiCall(apiSessionClient.api.auth[':id']['get-profile'].$get({ param: { id: userId } }));
});
