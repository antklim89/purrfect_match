import { cache } from 'react';
import type { ProfileUpdateType } from '@purrfect_match/shared/entities/auth/types';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

import { apiCall, apiClient } from '@/shared/lib/api-client';

export const getProfile = cache(async ({ headers }: { headers: ReadonlyHeaders }) => {
  return await apiCall(
    apiClient.api.auth['get-profile'].$get(undefined, { headers: Object.fromEntries(headers.entries()) }),
  );
});

export const updateProfile = cache(async ({ values }: { values: ProfileUpdateType }) => {
  return await apiCall(apiClient.api.auth['update-profile'].$post({ json: values }));
});
