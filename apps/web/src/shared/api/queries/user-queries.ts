import { cache } from 'react';

import { apiCall, apiSessionClient } from '@/shared/lib/api-client';

export const userFindQuery = cache(async ({ userId }: { userId: string }) => {
  return await apiCall(apiSessionClient.api.user[':id']['get-user'].$get({ param: { id: userId } }));
});
