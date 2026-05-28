import { z } from 'zod/v4-mini';

export const env = z
  .object({
    API_URL: z.url(),
    WEB_URL: z.url(),
  })
  .parse({
    API_URL: process.env.API_URL,
    WEB_URL: process.env.WEB_URL,
  });
