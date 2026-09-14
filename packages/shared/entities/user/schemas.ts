import { z } from 'zod/v4-mini';

import { CreateUserSchema } from '../auth/schemas';

export const UserContactSchema = z.object({
  type: z.string(),
  number: z.string().check(z.minLength(3), z.maxLength(50), z.regex(/[()-\d]/, 'Invalid phone number.')),
});

export const UserUpdateSchema = z.partial(
  z.object({
    name: CreateUserSchema.shape.name,
    fullName: z.string().check(z.maxLength(300)),
    address: z.string().check(z.maxLength(4000)),
    description: z.string().check(z.maxLength(4000)),
    contacts: z.array(UserContactSchema).check(z.maxLength(20, 'Too many contacts. Max allowed 20.')),
  }),
);
