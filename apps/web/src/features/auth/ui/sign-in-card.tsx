'use client';
import type { Route } from 'next';
import { BASE_ERROR_CODES } from 'better-auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { authClient } from '@/shared/lib/auth-client';
import { useAppForm } from '@/shared/lib/form';
import { buttonVariants } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { SignInForm } from './sign-in-form';
import { signInOptions } from '../models/form-options';

export function SignInCard() {
  const backHref = (useSearchParams().get('back') as Route) || '/';

  const form = useAppForm({
    ...signInOptions,
    async onSubmit({ value, formApi }) {
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

  return (
    <form.AppForm>
      <Card className="w-sm">
        <CardHeader>
          <h3 className="text-center">
            <span className="text-xl">Sign in</span>
            <br />
            <span className="text-lg">to the account.</span>
          </h3>
        </CardHeader>
        <CardContent>
          <SignInForm />
          <p className="my-4">
            Doesn't have an account{' '}
            <Link
              replace
              className="text-blue-600 underline dark:text-blue-400"
              href={`/auth/sign-up?back=${backHref}`}
            >
              Sign Up
            </Link>
          </p>
        </CardContent>
        <CardFooter className="w-full flex-col items-stretch gap-1">
          <form.FormSubmitButton submittingText="Signing in...">Sign in</form.FormSubmitButton>
          <Link href={backHref} replace className={buttonVariants({ variant: 'ghost' })}>
            Cancel
          </Link>
        </CardFooter>
      </Card>
    </form.AppForm>
  );
}
