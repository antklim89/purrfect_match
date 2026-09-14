import type { UserProfileUpdateType } from '@purrfect_match/shared/entities/auth/types';

import { apiCall, apiSessionClient } from '@/shared/lib/api-client';

export async function profileUpdateMutation({ values }: { values: Partial<UserProfileUpdateType> }) {
  return await apiCall(apiSessionClient.api.auth['update-profile'].$post({ json: values }));
}
