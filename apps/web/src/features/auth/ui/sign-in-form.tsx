'use client';

import { useTypedAppFormContext } from '@/shared/lib/form';
import { signInOptions } from '../models/form-options';

export function SignInForm() {
  const form = useTypedAppFormContext(signInOptions);

  return (
    <form.Form>
      <form.AppField name="email">
        {(field) => <field.FormInput autoComplete="email" placeholder="Enter your e-mail address" label="E-mail" />}
      </form.AppField>
      <form.AppField name="password">
        {(field) => (
          <field.FormInput autoComplete="current-password" type="password" placeholder="********" label="Password" />
        )}
      </form.AppField>
    </form.Form>
  );
}
