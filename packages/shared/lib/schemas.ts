import { z } from 'zod/v4-mini';

export const uuidv7Schema = z.object({
  id: z.string().check(z.uuidv7()),
});
