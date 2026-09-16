'use client';

import type { AdFilterType } from '@purrfect_match/shared/entities/ad/types';
import { animalBreeds, animalTypes } from '@purrfect_match/shared/entities/animal/constants';
import type { AnimalTypes } from '@purrfect_match/shared/entities/animal/types';
import { parseAsInteger, parseAsString, type UseQueryStatesKeysMap, useQueryStates } from 'nuqs';

import { useAppForm } from '@/shared/lib/form';
import { Button } from '@/shared/ui/button';

const ALL = 'all';

const keyMap: UseQueryStatesKeysMap<
  Required<Pick<AdFilterType, 'search' | 'type' | 'breed' | 'page' | 'minPrice' | 'maxPrice'>>
> = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault('').withOptions({ limitUrlUpdates: { method: 'debounce', timeMs: 700 } }),
  type: parseAsString.withDefault(ALL),
  breed: parseAsString.withDefault(ALL),
  minPrice: parseAsInteger.withDefault(0),
  maxPrice: parseAsInteger.withDefault(0),
};

export function AdFilter() {
  const [filter, setFilter] = useQueryStates(keyMap, { clearOnDefault: true, shallow: false });

  const form = useAppForm({
    defaultValues: filter,
    listeners: { onChange: ({ formApi }) => setFilter({ ...formApi.state.values, page: 1 }) },
  });

  function handleReset() {
    form.setFieldValue('search', '');
    form.setFieldValue('type', ALL);
    form.setFieldValue('breed', ALL);
    form.setFieldValue('minPrice', 0);
    form.setFieldValue('maxPrice', 0);
  }

  const selectedAnimalBreeds = animalBreeds[filter.type as AnimalTypes] ?? Object.values(animalBreeds).flat();

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

        <form.AppField name="type">
          {(field) => (
            <field.FormSelect className="capitalize" label="Types">
              <field.FormSelectItem value={ALL} className="capitalize">
                {ALL}
              </field.FormSelectItem>
              {animalTypes.map((animalType) => (
                <field.FormSelectItem className="capitalize" value={animalType} key={animalType}>
                  {animalType}
                </field.FormSelectItem>
              ))}
            </field.FormSelect>
          )}
        </form.AppField>

        <form.AppField name="breed">
          {(field) => (
            <field.FormSelect className="capitalize" label="Breeds">
              <field.FormSelectItem value={ALL} className="capitalize">
                {ALL}
              </field.FormSelectItem>
              {selectedAnimalBreeds.map((animalBreed) => (
                <field.FormSelectItem className="capitalize" value={animalBreed} key={animalBreed}>
                  {animalBreed}
                </field.FormSelectItem>
              ))}
            </field.FormSelect>
          )}
        </form.AppField>

        <Button onClick={handleReset} className="mt-8">
          Reset
        </Button>
      </form.AppForm>
    </div>
  );
}
