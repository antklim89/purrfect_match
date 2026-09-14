'use client';

import { type ADS_ORDER_BY, ADS_SORT_BY } from '@purrfect_match/shared/entities/ad/constants';
import type { AdFilterType } from '@purrfect_match/shared/entities/ad/types';
import { type Options, parseAsInteger, parseAsStringEnum, type UseQueryStatesKeysMap, useQueryStates } from 'nuqs';

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/shared/ui/select';

const defaultOptions: Options = { clearOnDefault: true, shallow: false };

const sortOptions = [
  {
    label: 'Older',
    value: 'old',
    sortBy: 'publishedAt',
    orderBy: 'desc',
  },
  {
    label: 'Newer',
    value: 'new',
    sortBy: 'publishedAt',
    orderBy: 'asc',
  },
  {
    label: 'Cheaper',
    value: 'cheep',
    sortBy: 'price',
    orderBy: 'asc',
  },
  {
    label: 'Expensive',
    value: 'expensive',
    sortBy: 'price',
    orderBy: 'desc',
  },
] as const satisfies {
  label: string;
  value: string;
  sortBy: (typeof ADS_SORT_BY)[number];
  orderBy: (typeof ADS_ORDER_BY)[number];
}[];

const keyMap: UseQueryStatesKeysMap<Required<Pick<AdFilterType, 'sortBy' | 'orderBy' | 'page'>>> = {
  page: parseAsInteger.withDefault(1),
  sortBy: parseAsStringEnum(ADS_SORT_BY as unknown as Array<(typeof ADS_SORT_BY)[number]>)
    .withDefault(sortOptions[0].sortBy)
    .withOptions(defaultOptions),
  orderBy: parseAsStringEnum(['asc', 'desc']).withDefault(sortOptions[0].orderBy).withOptions(defaultOptions),
};

export function AdSort() {
  const [sort, setSort] = useQueryStates(keyMap);

  const sortValue = sortOptions.find((i) => i.orderBy === sort.orderBy && i.sortBy === sort.sortBy) || sortOptions[0];

  return (
    <Select
      value={sortValue.value}
      onValueChange={(value) => {
        const query = sortOptions.find((i) => i.value === value) || sortOptions[0];
        setSort({ page: 1, orderBy: query.orderBy, sortBy: query.sortBy });
      }}
    >
      <SelectTrigger>{sortValue.label}</SelectTrigger>
      <SelectContent>
        {sortOptions.map(({ label, value }) => (
          <SelectItem value={value} key={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
