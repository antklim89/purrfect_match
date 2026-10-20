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

export async function apiCall<T, Dto, U extends number = StatusCode, F extends ResponseFormat = string>(
  fetchResponse: Promise<ClientResponse<T, U, F>>,
  dto?: undefined,
): Promise<{ error: { message: string; status: U }; data: null } | { error: null; data: T }>;

export async function apiCall<T, Dto, U extends number = StatusCode, F extends ResponseFormat = string>(
  fetchResponse: Promise<ClientResponse<T, U, F>>,
  dto: (data: T) => Dto,
): Promise<{ error: { message: string; status: U }; data: null } | { error: null; data: Dto }>;

export async function apiCall<T, Dto, U extends number = StatusCode, F extends ResponseFormat = string>(
  fetchResponse: Promise<ClientResponse<T, U, F>>,
  dto?: (data: T) => Dto,
) {
  const response = await fetchResponse;

  if (!response.ok) {
    const error = (await response.json()) as { message: string };
    return { error: { message: error.message, status: response.status }, data: null };
  }

  if (response.status === 204) return { error: null, data: null as T };

  const json = (await response.json()) as T;
  const data = dto ? dto(json) : json;
  return { data, error: null };
}
