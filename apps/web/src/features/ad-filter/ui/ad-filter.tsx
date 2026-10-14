'use client';

import { type ReactNode, useId } from 'react';
import { AdFilterSchema } from '@purrfect_match/shared/entities/ad/schemas';
import { XIcon } from 'lucide-react';
import Link from 'next/link';
import { parseAsString, useQueryStates } from 'nuqs';

import { buttonVariants } from '@/shared/ui/button';
import { Field, FieldLabel } from '@/shared/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/shared/ui/input-group';

const keyMap = {
  page: parseAsString,
  search: parseAsString.withDefault(''),
  minPrice: parseAsString.withDefault(''),
  maxPrice: parseAsString.withDefault(''),
};
const options = {
  clearOnDefault: true,
  shallow: false,
  limitUrlUpdates: { method: 'debounce', timeMs: 700 },
} as const;

const fields = [
  {
    name: 'search',
    label: 'Search',
    type: 'string',
    placeholder: 'Enter search term...',
  },
  {
    name: 'minPrice',
    label: 'Min Price',
    type: 'number',
    placeholder: 'Enter minimum price...',
  },
  {
    name: 'maxPrice',
    label: 'Max Price',
    type: 'number',
    placeholder: 'Enter maximum price...',
  },
] as const;

export function AdFilter({ filtersSlot }: { filtersSlot?: ReactNode }) {
  const id = useId();
  const [filter, setFilter] = useQueryStates(keyMap, options);

  return (
    <div className="flex flex-col gap-4 h-full">
      {fields.map((field) => {
        return (
          <Field key={field.name}>
            <FieldLabel htmlFor={`${field.name}-${id}`}>{field.label}</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id={`${field.name}-${id}`}
                placeholder={field.placeholder}
                value={filter[field.name]}
                onChange={(e) => {
                  if (e.target.value.length === 0) return setFilter({ [field.name]: null, page: null });
                  const { success, data } = AdFilterSchema.shape[field.name].safeParse(e.target.value);
                  if (success) setFilter({ [field.name]: data, page: null });
                }}
              />
              {(Number(filter[field.name]) >= 0 || filter[field.name]?.length > 0) && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton onClick={() => setFilter({ [field.name]: null, page: null })}>
                    <span className="sr-only">clear {field.name} filter</span> <XIcon />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
          </Field>
        );
      })}

      {filtersSlot}

      <Link href="/ad" className={buttonVariants({ variant: 'outline', className: 'mt-6' })}>
        Reset
      </Link>
    </div>
  );
}
