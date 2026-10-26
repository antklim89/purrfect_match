'use client';

import { type ReactNode, useId } from 'react';
import { AdFilterSchema } from '@purrfect_match/shared/entities/ad/schemas';
import { genders } from '@purrfect_match/shared/models/gender';
import { XIcon } from 'lucide-react';
import Link from 'next/link';
import { parseAsString, useQueryStates } from 'nuqs';

import { calculateAge, cn, formatIsoDate } from '@/shared/lib/utils';
import { Button, buttonVariants } from '@/shared/ui/button';
import { Field, FieldLabel } from '@/shared/ui/field';
import { Gender } from '@/shared/ui/gender';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/shared/ui/input-group';

const keyMap = {
  page: parseAsString,
  search: parseAsString.withDefault(''),
  minPrice: parseAsString.withDefault(''),
  maxPrice: parseAsString.withDefault(''),
  gender: parseAsString.withDefault(''),
  youngerThan: parseAsString.withDefault(formatIsoDate(new Date())),
  olderThan: parseAsString.withDefault(formatIsoDate(new Date())),
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

const ageFields = [
  {
    name: 'youngerThan',
    label: 'Younger than',
  },
  {
    name: 'olderThan',
    label: 'Older than',
  },
] as const;

function calculateDateFromAge(year: number, month: number) {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - month);
  currentDate.setFullYear(currentDate.getFullYear() - year);

  return formatIsoDate(currentDate);
}

export function AdFilter({ filtersSlot }: { filtersSlot?: ReactNode }) {
  const id = useId();
  const [filter, setFilter] = useQueryStates(keyMap, options);

  return (
    <div className="flex flex-col gap-4 h-full">
      {filtersSlot}

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

      <Field>
        <FieldLabel>Gender</FieldLabel>
        <div className="flex gap-2">
          {genders.map((gender) => (
            <Button
              onClick={() => {
                if (gender === filter.gender) setFilter({ gender: null, page: null });
                else setFilter({ gender, page: null });
              }}
              key={gender}
              className={cn('capitalize grow', { 'border-primary!': gender === filter.gender })}
              variant="outline"
            >
              <Gender gender={gender} /> {gender}
            </Button>
          ))}
        </div>
      </Field>

      {ageFields.map((field) => {
        const age = calculateAge(filter[field.name]);

        return (
          <Field key={field.name}>
            <FieldLabel>{field.label}</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <InputGroup>
                <InputGroupInput
                  value={age?.years || ''}
                  onChange={(e) =>
                    setFilter({
                      [field.name]: calculateDateFromAge(Number(e.target.value), age?.months || 0),
                      page: null,
                    })
                  }
                  placeholder="0"
                  min={0}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>year</InputGroupText>
                </InputGroupAddon>
              </InputGroup>

              <InputGroup>
                <InputGroupInput
                  value={age?.months || ''}
                  onChange={(e) =>
                    setFilter({
                      [field.name]: calculateDateFromAge(age?.years || 0, Number(e.target.value)),
                      page: null,
                    })
                  }
                  placeholder="0"
                  min={0}
                  max={12}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>month</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </Field>
        );
      })}

      <Link href="/ad" className={buttonVariants({ variant: 'outline', className: 'mt-6' })}>
        Reset
      </Link>
    </div>
  );
}
