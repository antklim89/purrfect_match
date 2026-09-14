import { z } from 'zod/v4-mini';

export const SignInSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .check(
      z.minLength(3, 'Too small: expected password to have >= 2 characters'),
      z.maxLength(500, 'Too large: expected password to have < 500 characters'),
    ),
});

export const CreateUserSchema = z.object({
  email: SignInSchema.shape.email,
  name: z
    .string()
    .check(
      z.minLength(2, 'Too small: expected name to have >= 2 characters'),
      z.maxLength(500, 'Too large: expected name to have < 500 characters'),
      z.regex(/[a-z0-9]/i, 'Only latin characters and numbers allowed.'),
    ),
});

export const SignUpSchema = z
  .object({
    password: SignInSchema.shape.password,
    confirm: z.string(),
    ...CreateUserSchema.shape,
  })
  .check(
    z.superRefine((v, ctx) => {
      if (v.password !== v.confirm)
        ctx.addIssue({ path: ['confirm'], code: 'custom', message: "Passwords don't match" });
    }),
  );
