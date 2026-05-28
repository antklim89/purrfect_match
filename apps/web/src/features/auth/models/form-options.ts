import { BASE_ERROR_CODES } from 'better-auth';
import { toast } from 'sonner';

import { authClient } from '@/shared/lib/auth';
import { createFormOptions } from '@/shared/lib/form';
import { SignInSchema, SignUpSchema } from './schema';

export const signInOptions = createFormOptions({
  schema: SignInSchema,
  defaultValues: {
    email: '',
    password: '',
  },
  async onSubmit({ value, formApi }) {
    const backHref = new URLSearchParams(location.search).get('back') || '/';

    toast.loading('Signing in...', { id: formApi.formId });
    const { error } = await authClient.signIn.email({ email: value.email, password: value.password });

    if (error?.code === BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD.code) {
      return toast.error(error.message, { id: formApi.formId });
    }
    if (error) {
      return toast.error('Failed to sign in. Try again later', { id: formApi.formId });
    }
    toast.success('Sign in successfully', { id: formApi.formId });

    location.replace(backHref);
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
  async onSubmit({ value, formApi }) {
    const backHref = new URLSearchParams(location.search).get('back') || '/';

    toast.loading('Signing up...', { id: formApi.formId });
    const { error } = await authClient.signUp.email({ email: value.email, password: value.password, name: '' });

    if (error?.code === BASE_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL.code) {
      return toast.error(error.message, { id: formApi.formId });
    }
    if (error) {
      return toast.error('Failed to sign up. Try again later', { id: formApi.formId });
    }
    toast.success('Sign up successfully', { id: formApi.formId });

    location.replace(backHref);
  },
});
