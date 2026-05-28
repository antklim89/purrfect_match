import type { ComponentProps } from 'react';

import { Button } from './button';
import { Field, FieldError, FieldLabel } from './field';
import { Input } from './input';
import { Spinner } from './spinner';
import { Textarea } from './textarea';
import { useFieldContext, useFormContext } from '../lib/form';
import { cn } from '../lib/utils';

export function FormInput({
  label,
  errors,
  ...props
}: ComponentProps<'input'> & { label?: string; errors?: Array<{ message?: string } | undefined> }) {
  const field = useFieldContext<string>();

  return (
    <Field>
      {label ? <FieldLabel htmlFor={field.name + field.form.formId}>{label}</FieldLabel> : null}
      <Input
        id={field.name + field.form.formId}
        value={field.state.value}
        onChange={e => field.handleChange(e.target.value)}
        {...props}
      />
      <FieldError errors={errors} />
    </Field>
  );
}

export function FormTextarea({
  label,
  errors,
  ...props
}: ComponentProps<'textarea'> & { label?: string; errors?: Array<{ message?: string } | undefined> }) {
  const field = useFieldContext<string>();

  return (
    <Field>
      {label ? <FieldLabel htmlFor={field.name + field.form.formId}>{label}</FieldLabel> : null}
      <Textarea
        id={field.name + field.form.formId}
        {...props}
        value={field.state.value}
        onChange={e => field.handleChange(e.target.value)}
      />
      <FieldError errors={errors} />
    </Field>
  );
}

export function Form({ onSubmit, children, className, ...props }: ComponentProps<'form'>) {
  const form = useFormContext();

  return (
    <form
      className={cn('flex w-full flex-col gap-2', className)}
      id={form.formId}
      {...props}
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {children}
    </form>
  );
}

export function FormSubmitButton({
  onSubmit,
  children,
  submittingText,
  ...props
}: ComponentProps<'button'> & { submittingText?: string }) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={state => ({
        isSubmitting: state.isSubmitting,
        isDisabled: !state.canSubmit,
      })}
    >
      {({ isSubmitting, isDisabled }) => (
        <Button type="submit" form={form.formId} disabled={isSubmitting || isDisabled} {...props}>
          {isSubmitting ? <Spinner data-icon="inline-start" /> : null}{' '}
          {!isSubmitting ? children : submittingText ? submittingText : children}
        </Button>
      )}
    </form.Subscribe>
  );
}
