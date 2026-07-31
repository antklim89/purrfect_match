import { errUnexpected } from '@purrfect_match/shared/lib/result';
import { hc, type parseResponse } from 'hono/client';

import { env } from './env';
import type { AppType } from '../types/api-generated/app';

export const apiClient = hc<AppType>(typeof window === 'undefined' ? env.API_URL : env.WEB_URL);

export const apiParse: typeof parseResponse = async fetchRes => {
  try {
    const response = await fetchRes;

    if (!response.ok) return errUnexpected('Failed to make request.');
    return (await response.json()) as ReturnType<typeof parseResponse>;
  } catch (error) {
    console.error('Fetch Error:\n', error);
    return errUnexpected('Failed to make request.');
  }
};
