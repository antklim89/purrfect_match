import type { ClientResponse } from 'hono/client';
import type { ResponseFormat } from 'hono/types';
import type { StatusCode } from 'hono/utils/http-status';

export async function testApiCall<T, U extends number = StatusCode, F extends ResponseFormat = string>(
  fetchRes: Promise<ClientResponse<T, U, F>>,
) {
  try {
    const response = await fetchRes;

    if (!response.ok) {
      const error = (await response.json()) as { message: string };
      return { error: { message: error.message, status: response.status }, data: null };
    }

    const data = (await response.json()) as T;
    return { data, error: null };
  } catch (error) {
    console.error('Fetch Error:\n', error);
    return { error: { message: 'Failed to make request.', status: 500 as U }, data: null };
  }
}
