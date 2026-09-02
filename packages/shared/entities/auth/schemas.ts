import { z } from 'zod/v4-mini';

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().check(z.minLength(3), z.maxLength(500)),
});

export const CreateUserSchema = z.object({
  email: SignInSchema.shape.email,
  name: z.string().check(z.minLength(2), z.maxLength(500)),
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
