import { z } from 'zod/v4-mini';

export const env = z
  .object({
    API_URL: z.url(),
    WEB_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
  })
  .parse(Bun.env);
