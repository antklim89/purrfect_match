'use client';
import type { Route } from 'next';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useAppForm } from '@/shared/lib/form';
import { buttonVariants } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';
import { signInOptions, signUpOptions } from '../models/form-options';

export function AuthCard({ type }: { type: 'signIn' | 'signUp' }) {
  const backHref = (useSearchParams().get('back') as Route) || '/';

  const signUpForm = useAppForm(signUpOptions);
  const signInForm = useAppForm(signInOptions);

  const form = type === 'signIn' ? signInForm : signUpForm;

  return (
    <form.AppForm>
      <Card className="w-sm">
        <CardHeader>
          <h3 className="text-center">
            <span className="text-xl">{type === 'signIn' ? 'Sign in' : 'Sign up'}</span>
            <br />
            <span className="text-lg">to the account.</span>
          </h3>
        </CardHeader>
        <CardContent>
          <div>{type === 'signIn' ? <SignInForm /> : <SignUpForm />}</div>
          <div className="my-4">
            {type === 'signIn' ? (
              <p>
                Doesn't have an account{' '}
                <Link className="text-blue-600" href="/auth/sign-up">
                  Sign Up
                </Link>
              </p>
            ) : (
              <p>
                Already have an account{' '}
                <Link className="text-blue-600" href="/auth/sign-in">
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="w-full flex-col items-stretch gap-1">
          <form.FormSubmitButton submittingText={type === 'signIn' ? 'Signing in...' : 'Signing up...'}>
            {type === 'signIn' ? 'Sign in' : 'Sign up'}
          </form.FormSubmitButton>
          <Link href={backHref} replace className={buttonVariants({ variant: 'ghost' })}>
            Cancel
          </Link>
        </CardFooter>
      </Card>
    </form.AppForm>
  );
}
