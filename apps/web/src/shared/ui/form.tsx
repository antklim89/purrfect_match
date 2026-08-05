import type { ComponentProps } from 'react';
import { XIcon } from 'lucide-react';

import { Button } from './button';
import { Field, FieldError, FieldLabel } from './field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextarea } from './input-group';
import { Spinner } from './spinner';
import { useFieldContext, useFormContext } from '../lib/form';
import { cn } from '../lib/utils';

export function FormInput({
  label,
  errors,
  ...props
}: ComponentProps<'input'> & { label?: string; errors?: Array<{ message?: string } | undefined> }) {
  const field = useFieldContext<string>();

  return (
    <Field data-invalid={!field.state.meta.isValid}>
      {label ? <FieldLabel htmlFor={field.name + field.form.formId}>{label}</FieldLabel> : null}
      <InputGroup>
        <InputGroupInput
          aria-invalid={!field.state.meta.isValid}
          id={field.name + field.form.formId}
          value={field.state.value}
          onChange={e => field.handleChange(e.target.value)}
          {...props}
        />
        {field.state.value.length > 0 && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={() => field.setValue('')}>
              <span className="sr-only">clear {field.name} input</span> <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
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
    <Field data-invalid={!field.state.meta.isValid}>
      {label ? <FieldLabel htmlFor={field.name + field.form.formId}>{label}</FieldLabel> : null}
      <InputGroup>
        <InputGroupTextarea
          aria-invalid={!field.state.meta.isValid}
          id={field.name + field.form.formId}
          {...props}
          value={field.state.value}
          onChange={e => field.handleChange(e.target.value)}
        />
        {field.state.value.length > 0 && (
          <InputGroupAddon align="inline-end" className="self-start">
            <InputGroupButton onClick={() => field.setValue('')}>
              <span className="sr-only">clear {field.name} input</span> <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
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
    <form.Subscribe selector={state => state.isSubmitting}>
      {isSubmitting => (
        <Button type="submit" form={form.formId} disabled={isSubmitting} {...props}>
          {isSubmitting ? <Spinner data-icon="inline-start" /> : null}{' '}
          {isSubmitting ? (submittingText ? submittingText : children) : children}
        </Button>
      )}
    </form.Subscribe>
  );
}
