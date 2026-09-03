import { createAuthClient } from 'better-auth/react';

import { env } from './env';

const baseURL = typeof window === 'undefined' ? env.API_URL : env.WEB_URL;

export const authClient = createAuthClient({
  baseURL,
  sessionOptions: {
    refetchOnWindowFocus: false,
  },
  fetchOptions: {
    async onRequest(context) {
      if (typeof window === 'undefined') {
        context.headers = await import('next/headers').then((m) => m.headers());
      }
    },
  },
});
