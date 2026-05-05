import { zValidator } from '@hono/zod-validator';
import z from 'zod/v4';

export const CreateAdSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  category: z.string(),
});

export const createAdValidator = zValidator('json', CreateAdSchema);
