import type { ComponentProps, ReactNode } from 'react';
import { createFormHookContexts } from '@tanstack/react-form';
import { XIcon } from 'lucide-react';
import { z } from 'zod/v4-mini';

import { Button } from './button';
import { Field, FieldError, FieldLabel, FieldSet } from './field';
import type { Input } from './input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextarea } from './input-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Spinner } from './spinner';
import { cn } from '../lib/utils';

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

export function FormInput({ label, ...props }: ComponentProps<'input'> & { label?: string }) {
  const field = useFieldContext<string>();

  return (
    <Field data-invalid={!field.state.meta.isValid}>
      {label ? <FieldLabel htmlFor={field.name + field.form.formId}>{label}</FieldLabel> : null}
      <InputGroup>
        <InputGroupInput
          aria-invalid={!field.state.meta.isValid}
          id={field.name + field.form.formId}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
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
      <FieldError errors={field.state.meta.errors} />
    </Field>
  );
}

export function FormNumberInput({ label, ...props }: ComponentProps<typeof Input> & { label?: string }) {
  const field = useFieldContext<number>();

  return (
    <Field data-invalid={!field.state.meta.isValid}>
      {label ? <FieldLabel htmlFor={field.name + field.form.formId}>{label}</FieldLabel> : null}
      <InputGroup>
        <InputGroupInput
          aria-invalid={!field.state.meta.isValid}
          inputMode="numeric"
          id={field.name + field.form.formId}
          value={field.state.value}
          onChange={(e) => field.handleChange(z.catch(z.coerce.number(), 0).parse(e.target.value))}
          {...props}
        />
        {field.state.value > 0 && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={() => field.setValue(0)}>
              <span className="sr-only">clear {field.name} input</span> <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      <FieldError errors={field.state.meta.errors} />
    </Field>
  );
}

export function FormTextarea({ label, ...props }: ComponentProps<'textarea'> & { label?: string }) {
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
          onChange={(e) => field.handleChange(e.target.value)}
        />
        {field.state.value.length > 0 && (
          <InputGroupAddon align="inline-end" className="self-start">
            <InputGroupButton onClick={() => field.setValue('')}>
              <span className="sr-only">clear {field.name} input</span> <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
      <FieldError errors={field.state.meta.errors} />
    </Field>
  );
}

export function Form({ children, className, ...props }: ComponentProps<'form'>) {
  const form = useFormContext();

  return (
    <form
      className={cn('flex w-full flex-col gap-2', className)}
      id={form.formId}
      {...props}
      onSubmit={(e) => {
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
}: ComponentProps<typeof Button> & { submittingText?: string }) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" form={form.formId} disabled={isSubmitting} {...props}>
          {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
          {isSubmitting ? (submittingText ? submittingText : children) : children}
        </Button>
      )}
    </form.Subscribe>
  );
}

export function FormArray({ label, children }: { label?: string; children: ReactNode }) {
  const field = useFieldContext<unknown[]>();

  return (
    <FieldSet className="flex flex-col gap-2">
      <FieldLabel htmlFor={field.form.formId + (field.state.value.length - 1)}>{label}</FieldLabel>
      {children}
      <FieldError errors={field.state.meta.errors} />
    </FieldSet>
  );
}

export function FormSelect<T>({
  children,
  label,
  placeholder,
  ...props
}: ComponentProps<typeof SelectTrigger> & {
  label?: string;
  placeholder?: string;
}) {
  const field = useFieldContext<T>();

  return (
    <Field>
      {label ? <FieldLabel htmlFor={field.name + field.form.formId}>{label}</FieldLabel> : null}
      <Select onValueChange={(v) => v && field.handleChange(v)} value={field.state.value}>
        <SelectTrigger {...props}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger>{children}</SelectContent>
      </Select>
      <FieldError errors={field.state.meta.errors} />
    </Field>
  );
}

export function FormSelectItem<T>(props: { value: T } & ComponentProps<typeof SelectItem>) {
  return <SelectItem {...props} />;
}
