'use client';

import type { ReactNode } from 'react';
import { animalBreeds, animalTypes } from '@purrfect_match/shared/entities/animal/constants';
import type { AnimalTypes } from '@purrfect_match/shared/entities/animal/types';
import { parseAsString, useQueryStates } from 'nuqs';

import { useAppForm } from '@/shared/lib/form';
import { Button } from '@/shared/ui/button';

const ALL = 'all';

export function AdCatalogFilters({ children }: { children?: ReactNode }) {
  const [filter, setFilter] = useQueryStates({
    search: parseAsString
      .withDefault('')
      .withOptions({ limitUrlUpdates: { method: 'debounce', timeMs: 700 }, shallow: false }),

    type: parseAsString.withDefault(ALL).withOptions({ clearOnDefault: true, shallow: false }),
    breed: parseAsString.withDefault(ALL).withOptions({ clearOnDefault: true, shallow: false }),
  });

  const selectedAnimalBreeds = animalBreeds[filter.type as AnimalTypes] ?? Object.values(animalBreeds).flat();

  const form = useAppForm({
    defaultValues: filter,
    listeners: {
      onChange: ({ formApi }) => setFilter(formApi.state.values),
    },
  });

  function handleReset() {
    form.setFieldValue('search', '');
    form.setFieldValue('type', ALL);
    form.setFieldValue('breed', ALL);
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <form.AppForm>
        <form.AppField name="search">
          {field => <field.FormInput label="Search" placeholder="Enter search term..." />}
        </form.AppField>

        <form.AppField name="type">
          {field => (
            <field.FormSelect className="capitalize" label="Types">
              <field.FormSelectItem value={ALL} className="capitalize">
                {ALL}
              </field.FormSelectItem>
              {animalTypes.map(animalType => (
                <field.FormSelectItem className="capitalize" value={animalType} key={animalType}>
                  {animalType}
                </field.FormSelectItem>
              ))}
            </field.FormSelect>
          )}
        </form.AppField>

        <form.AppField name="breed">
          {field => (
            <field.FormSelect className="capitalize" label="Breeds">
              <field.FormSelectItem value={ALL} className="capitalize">
                {ALL}
              </field.FormSelectItem>
              {selectedAnimalBreeds.map(animalBreed => (
                <field.FormSelectItem className="capitalize" value={animalBreed} key={animalBreed}>
                  {animalBreed}
                </field.FormSelectItem>
              ))}
            </field.FormSelect>
          )}
        </form.AppField>

        {children}

        <Button onClick={handleReset} className="mt-8">
          Reset
        </Button>
      </form.AppForm>
    </div>
  );
}
