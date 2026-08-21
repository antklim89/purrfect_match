import { cache } from 'react';
import type { ProfileUpdateType } from '@purrfect_match/shared/entities/auth/types';

import { apiCall, apiClient, apiSessionClient } from '@/shared/lib/api-client';

export const getProfile = cache(async () => {
  return await apiCall(apiSessionClient.api.profile['get-profile'].$get());
});

export const updateProfile = cache(async ({ values }: { values: ProfileUpdateType }) => {
  return await apiCall(apiClient.api.profile['update-profile'].$post({ json: values }));
});
