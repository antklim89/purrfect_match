import type { ComponentProps, ReactNode } from 'react';
import { Trash2Icon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { z } from 'zod/v4-mini';

import { Button, buttonVariants } from './button';
import { Field, FieldError, FieldLabel, FieldSet } from './field';
import { Input } from './input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextarea } from './input-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './select';
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

export function FormFileInput({
  label,
  errors,
  ...props
}: ComponentProps<'input'> & { label?: string; errors?: Array<{ message?: string } | undefined> }) {
  const field = useFieldContext<File[]>();

  return (
    <Field data-invalid={!field.state.meta.isValid}>
      <FieldLabel className={buttonVariants({ variant: 'outline' })} htmlFor={field.name + field.form.formId}>
        {label ?? 'Upload'}
      </FieldLabel>
      <Input
        className="hidden"
        aria-invalid={!field.state.meta.isValid}
        id={field.name + field.form.formId}
        multiple
        type="file"
        onChange={e => {
          if (!e.target.files) return;
          const files = Array.from(e.target.files);
          field.handleChange([...field.state.value, ...files]);
          e.target.value = '';
        }}
        {...props}
      />
      <div className="flex flex-col gap-1">
        {field.state.value.map((img, index) => (
          <div key={img.name} className="flex gap-2 items-center">
            <Image
              src={URL.createObjectURL(img)}
              alt="uploaded image"
              className="w-16 aspect-square object-cover"
              width={64}
              height={64}
            />
            <span className="grow">{img.name}</span>
            <Button variant="destructive" onClick={() => field.removeValue(index)}>
              <span className="sr-only">Remove uploaded image</span>
              <Trash2Icon />
            </Button>
          </div>
        ))}
      </div>
      <FieldError errors={errors} />
    </Field>
  );
}

export function FormNumberInput({
  label,
  errors,
  ...props
}: ComponentProps<typeof Input> & { label?: string; errors?: Array<{ message?: string } | undefined> }) {
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
          onChange={e => field.handleChange(z.catch(z.coerce.number(), 0).parse(e.target.value))}
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
}: ComponentProps<typeof Button> & { submittingText?: string }) {
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

export function FormSelect<T extends { label: React.ReactNode; value: unknown }>({
  items,
}: {
  items: ReadonlyArray<T>;
}) {
  const field = useFieldContext<T>();

  const firstItem = items[0];
  if (!firstItem) return null;
  return (
    <Select
      onValueChange={v => field.handleChange(v ?? firstItem)}
      items={items}
      value={field.state.value || firstItem.value}
    >
      <SelectTrigger className="-ml-1 ">
        <SelectValue placeholder="Messenger" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger>
        <SelectGroup>
          {items.map(item => (
            <SelectItem key={item.value as string} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
