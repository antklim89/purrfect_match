import { cache } from 'react';
import { cacheLife } from 'next/cache';

import { apiCall, apiClient } from '@/shared/lib/api-client';

export const animalFindManyQuery = cache(async () => {
  'use cache';
  cacheLife('max');
  return await apiCall(apiClient.api.animal.$get());
});

export const animalFindOneQuery = cache(async ({ name }: { name: string }) => {
  'use cache';
  cacheLife('max');
  return await apiCall(apiClient.api.animal[':name'].$get({ param: { name } }));
});
