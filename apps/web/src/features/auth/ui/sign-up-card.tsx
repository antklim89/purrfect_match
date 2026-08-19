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
import { SignUpForm } from './sign-up-form';
import { signUpOptions } from '../models/form-options';

export function SignUpCard() {
  const backHref = (useSearchParams().get('back') as Route) || '/';

  const form = useAppForm({
    ...signUpOptions,
    async onSubmit({ value, formApi }) {
      toast.loading('Signing up...', { id: formApi.formId });

      const { error } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: value.name,
      });

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

  return (
    <form.AppForm>
      <Card className="w-sm">
        <CardHeader>
          <h3 className="text-center">
            <span className="text-xl">Sign up</span>
            <br />
            <span className="text-lg">to the account.</span>
          </h3>
        </CardHeader>
        <CardContent>
          <SignUpForm />
          <p className="my-4">
            Already have an account{' '}
            <Link
              replace
              className="text-blue-600 underline dark:text-blue-400"
              href={`/auth/sign-in?back=${backHref}`}
            >
              Sign In
            </Link>
          </p>
        </CardContent>
        <CardFooter className="w-full flex-col items-stretch gap-1">
          <form.FormSubmitButton submittingText="Signing up...">Sign up</form.FormSubmitButton>
          <Link href={backHref} replace className={buttonVariants({ variant: 'ghost' })}>
            Cancel
          </Link>
        </CardFooter>
      </Card>
    </form.AppForm>
  );
}
