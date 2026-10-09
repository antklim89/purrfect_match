'use client';

import type { ReactNode } from 'react';
import type { AdFilterType } from '@purrfect_match/shared/entities/ad/types';
import Link from 'next/link';
import { parseAsInteger, parseAsString, type UseQueryStatesKeysMap, useQueryStates } from 'nuqs';

import { useAppForm } from '@/shared/lib/form';
import { buttonVariants } from '@/shared/ui/button';

const keyMap: UseQueryStatesKeysMap<Required<Pick<AdFilterType, 'search' | 'page' | 'minPrice' | 'maxPrice'>>> = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(''),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
};
const options = { clearOnDefault: true, shallow: false };

export function AdFilter({ filtersSlot }: { filtersSlot?: ReactNode }) {
  const [filter, setFilter] = useQueryStates(keyMap, options);

  const form = useAppForm({
    defaultValues: filter,
    listeners: {
      onChangeDebounceMs: 700,
      onChange({ formApi }) {
        setFilter({ ...formApi.state.values, page: 1 });
      },
    },
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      <form.AppForm>
        <form.AppField name="search">
          {(field) => <field.FormInput clear label="Search" placeholder="Enter search term..." />}
        </form.AppField>

        <form.AppField name="minPrice">
          {(field) => <field.FormInputNumber clear label="Min Price" placeholder="Enter minimum price..." />}
        </form.AppField>

        <form.AppField name="maxPrice">
          {(field) => <field.FormInputNumber clear label="Max Price" placeholder="Enter maximum price..." />}
        </form.AppField>

        {filtersSlot}

        <Link href="/ad" className={buttonVariants({ variant: 'outline', className: 'mt-6' })}>
          Reset
        </Link>
      </form.AppForm>
    </div>
  );
}
