import { createAuthClient } from 'better-auth/react';

import { env } from './env';

export const authClient = createAuthClient({
  baseURL: typeof window === 'undefined' ? env.API_URL : env.WEB_URL,
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
});
