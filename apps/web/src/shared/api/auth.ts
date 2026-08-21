import { cache } from 'react';
import type { BetterAuthClientOptions } from 'better-auth';

import { authClient } from '@/shared/lib/auth-client';

export const getSession = cache(async (options?: BetterAuthClientOptions) => {
  const { data, error } = await authClient.getSession(options);
  return { user: data?.user || null, session: data?.session || null, error };
});
