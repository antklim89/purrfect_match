import type { AppType } from '@purrfect_match/api/app';
import { type ClientResponse, hc } from 'hono/client';
import type { ResponseFormat } from 'hono/types';
import type { StatusCode } from 'hono/utils/http-status';

import { env } from './env';

export const apiClient = hc<AppType>(typeof window === 'undefined' ? env.API_URL : env.WEB_URL);

export const apiSessionClient = hc<AppType>(
  typeof window === 'undefined' ? env.API_URL : env.WEB_URL,
  typeof window === 'undefined'
    ? {
        async headers() {
          const { headers: getHeaders } = await import('next/headers');
          const headers = await getHeaders();
          return Object.fromEntries(headers.entries());
        },
      }
    : undefined,
);

export async function apiCall<T, U extends number = StatusCode, F extends ResponseFormat = string>(
  fetchResponse: Promise<ClientResponse<T, U, F>>,
) {
  const response = await fetchResponse;

  if (!response.ok) {
    const error = (await response.json()) as { message: string };
    return { error: { message: error.message, status: response.status }, data: null };
  }

  if (response.status === 204) return { error: null, data: null as T };

  const data = (await response.json()) as T;
  return { data, error: null };
}
