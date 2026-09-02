import { z } from 'zod/v4-mini';

export const ProfileContactSchema = z.object({
  type: z.string(),
  number: z.string().check(z.minLength(3), z.maxLength(50), z.regex(/[()-\d]/, 'Invalid phone number.')),
});

export const ProfileUpdateSchema = z.object({
  fullName: z.optional(z.string().check(z.maxLength(300))),
  address: z.optional(z.string().check(z.maxLength(4000))),
  description: z.optional(z.string().check(z.maxLength(4000))),
  contacts: z.optional(z.array(ProfileContactSchema).check(z.maxLength(20, 'Too many contacts. Max allowed 20.'))),
});
