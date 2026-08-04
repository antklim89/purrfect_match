import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { env } from './env';
import type { auth } from '../types/api-generated/lib/auth';

export const authClient = createAuthClient({
  baseURL: typeof window === 'undefined' ? env.API_URL : env.WEB_URL,
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
  plugins: [inferAdditionalFields<typeof auth>()],
});
