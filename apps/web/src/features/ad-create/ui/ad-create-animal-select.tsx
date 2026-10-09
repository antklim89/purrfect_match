'use client';
import type { AnimalType } from '@purrfect_match/shared/entities/animal/types';

import { AnimalSelect } from '@/features/animal-select';
import { useTypedAppFormContext } from '@/shared/lib/form';
import { FieldError } from '@/shared/ui/field';
import { adCreateFormOptions } from '../models/form-options';

export function AdCreateAnimalSelect({ animals }: { animals: AnimalType[] }) {
  const form = useTypedAppFormContext(adCreateFormOptions);

  return (
    <form.AppField name="type">
      {(typeField) => (
        <form.AppField name="breed">
          {(breedField) => (
            <>
              <AnimalSelect
                animals={animals}
                typeName={typeField.state.value}
                breedName={breedField.state.value}
                onAnimalTypeSelect={(v) => {
                  breedField.handleChange('');
                  typeField.handleChange(v ?? '');
                }}
                onAnimalBreedSelect={(v) => breedField.handleChange(v ?? '')}
              />
              <FieldError errors={[...breedField.state.meta.errors, ...typeField.state.meta.errors]} />
            </>
          )}
        </form.AppField>
      )}
    </form.AppField>
  );
}
