'use client';
import type { AnimalType } from '@purrfect_match/shared/entities/animal/types';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

import { AnimalSelect } from '@/features/animal-select';

const queries = {
  type: parseAsString,
  breed: parseAsString,

  page: parseAsInteger,
};

export function AdAnimalSelect({ animals }: { animals: AnimalType[] }) {
  const [queryState, setQueryState] = useQueryStates(queries, { shallow: false });

  return (
    <AnimalSelect
      animals={animals}
      breedName={queryState.breed}
      typeName={queryState.type}
      onAnimalTypeSelect={(v) => setQueryState({ type: v, breed: null, page: null })}
      onAnimalBreedSelect={(v) => setQueryState({ breed: v, page: null })}
    />
  );
}
