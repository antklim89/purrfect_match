'use client';

import type { AdFilterType } from '@purrfect_match/shared/entities/ad/types';
import Link from 'next/link';
import { parseAsInteger, parseAsString, type UseQueryStatesKeysMap, useQueryStates } from 'nuqs';

import { useAppForm } from '@/shared/lib/form';
import { buttonVariants } from '@/shared/ui/button';

const ALL = 'all';

const keyMap: UseQueryStatesKeysMap<
  Required<Pick<AdFilterType, 'search' | 'type' | 'breed' | 'page' | 'minPrice' | 'maxPrice'>>
> = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault('').withOptions({ limitUrlUpdates: { method: 'debounce', timeMs: 700 } }),
  type: parseAsString.withDefault(ALL),
  breed: parseAsString.withDefault(ALL),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
};

export function AdFilter() {
  const [filter, setFilter] = useQueryStates(keyMap, { clearOnDefault: true, shallow: false });

  const form = useAppForm({
    defaultValues: filter,
    listeners: { onChange: ({ formApi }) => setFilter({ ...formApi.state.values, page: 1 }) },
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

        <Link href="/ad" className={buttonVariants({ variant: 'outline', className: 'mt-8' })}>
          Reset
        </Link>
      </form.AppForm>
    </div>
  );
}
