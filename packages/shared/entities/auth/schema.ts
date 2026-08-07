import { z } from 'zod/v4-mini';

export const UserMessengerSchema = z.object({
  messenger: z.string(),
  number: z.string().check(z.minLength(3), z.maxLength(50), z.regex(/[()-\d]/, 'Invalid phone number.')),
});

export const UserMessengersSchema = z
  .array(UserMessengerSchema)
  .check(z.maxLength(20, 'Too many phone numbers. Max allowed 20.'));

export const ProfileUpdateSchema = z.object({
  fullName: z.optional(z.string().check(z.maxLength(300))),
  address: z.optional(z.string().check(z.maxLength(4000))),
  description: z.optional(z.string().check(z.maxLength(4000))),
  messengers: z.optional(UserMessengersSchema),
});
