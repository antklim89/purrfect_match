import { SignInSchema, SignUpSchema } from '@purrfect_match/shared/entities/auth/schemas';

import { createFormOptions } from '@/shared/lib/form';

export const signInOptions = createFormOptions({
  schema: SignInSchema,
  defaultValues: {
    email: '',
    password: '',
  },
});

export const signUpOptions = createFormOptions({
  schema: SignUpSchema,
  defaultValues: {
    name: '',
    email: '',
    password: '',
    confirm: '',
  },
});
