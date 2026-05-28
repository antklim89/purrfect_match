import { z } from 'zod/v4-mini';

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().check(z.minLength(3), z.maxLength(500)),
});
export type SignInSchema = z.infer<typeof SignInSchema>;

export const SignUpSchema = z
  .object({
    email: SignInSchema.shape.email,
    password: SignInSchema.shape.password,
    name: z.string().check(z.minLength(2), z.maxLength(500)),
    confirm: z.string(),
  })
  .check(
    z.superRefine((v, ctx) => {
      if (v.password !== v.confirm)
        ctx.addIssue({ path: ['confirm'], code: 'custom', message: "Passwords don't match" });
    }),
  );
export type SignUpSchema = z.infer<typeof SignUpSchema>;
