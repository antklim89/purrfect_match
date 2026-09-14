import type { UserUpdateType } from '@purrfect_match/shared/entities/user/types';

import { apiCall, apiSessionClient } from '@/shared/lib/api-client';

export async function profileUpdateMutation({ values }: { values: Partial<UserUpdateType> }) {
  return await apiCall(apiSessionClient.api.user['update-user'].$post({ json: values }));
}
