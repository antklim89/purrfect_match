import { z } from 'zod/v4-mini';

import { ContactArraySchema } from '../contact/schema';

export const ProfileUpdateSchema = z.object({
  fullName: z.optional(z.string().check(z.maxLength(300))),
  address: z.optional(z.string().check(z.maxLength(4000))),
  description: z.optional(z.string().check(z.maxLength(4000))),
  contacts: z.optional(ContactArraySchema),
});
