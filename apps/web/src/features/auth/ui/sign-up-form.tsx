'use client';

import { useTypedAppFormContext } from '@/shared/lib/form';
import { signUpOptions } from '../models/form-options';

export function SignUpForm() {
  const form = useTypedAppFormContext(signUpOptions);

  return (
    <form.Form>
      <form.AppField name="name">
        {field => (
          <field.FormInput
            autoComplete="name"
            placeholder="Enter your name"
            label="Name"
            errors={field.state.meta.errors}
          />
        )}
      </form.AppField>
      <form.AppField name="email">
        {field => (
          <field.FormInput
            autoComplete="email"
            placeholder="Enter your e-mail address"
            label="E-mail"
            errors={field.state.meta.errors}
          />
        )}
      </form.AppField>
      <form.AppField name="password">
        {field => (
          <field.FormInput
            autoComplete="new-password"
            type="password"
            placeholder="********"
            label="Password"
            errors={field.state.meta.errors}
          />
        )}
      </form.AppField>
      <form.AppField name="confirm">
        {field => (
          <field.FormInput
            autoComplete="new-password"
            type="password"
            placeholder="********"
            label="Confirm password"
            errors={field.state.meta.errors}
          />
        )}
      </form.AppField>
    </form.Form>
  );
}
