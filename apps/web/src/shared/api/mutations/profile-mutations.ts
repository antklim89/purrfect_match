import type { ProfileUpdateType } from '@purrfect_match/shared/entities/profile/types';

import { apiCall, apiSessionClient } from '@/shared/lib/api-client';

export async function profileUpdateMutation({ values }: { values: ProfileUpdateType }) {
  return await apiCall(apiSessionClient.api.profile['update-profile'].$post({ json: values }));
}
