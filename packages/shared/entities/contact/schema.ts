import { z } from 'zod/v4-mini';

export const ContactSchema = z.object({
  type: z.string(),
  number: z.string().check(z.minLength(3), z.maxLength(50), z.regex(/[()-\d]/, 'Invalid phone number.')),
});

export const ContactArraySchema = z
  .array(ContactSchema)
  .check(z.maxLength(20, 'Too many phone numbers. Max allowed 20.'));
