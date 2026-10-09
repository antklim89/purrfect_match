'use client';

import type { AnimalType } from '@purrfect_match/shared/entities/animal/types';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/shared/ui/combobox';
import { Field, FieldLabel, FieldSet } from '@/shared/ui/field';

export function AnimalSelect({
  animals,
  breedName,
  typeName,
  onAnimalTypeSelect,
  onAnimalBreedSelect,
}: {
  animals: AnimalType[];
  breedName?: string | null;
  typeName?: string | null;
  onAnimalTypeSelect: (name: string | null) => void;
  onAnimalBreedSelect: (name: string | null) => void;
}) {
  const selectedAnimal = animals.find(
    (a) => a.name === typeName || a.breeds.findIndex((i) => i.name === breedName) >= 0,
  );
  const selectedBreed = selectedAnimal?.breeds.find((i) => i.name === breedName);

  return (
    <FieldSet className="flex flex-col">
      <Field>
        <FieldLabel>Animal Type</FieldLabel>
        <Combobox
          items={animals}
          itemToStringLabel={(i) => i.name}
          value={selectedAnimal || null}
          onValueChange={(v) => onAnimalTypeSelect(v?.name ?? null)}
        >
          <ComboboxInput showClear placeholder="Select animal type..." />
          <ComboboxContent>
            <ComboboxEmpty>No animal types found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem className="" key={item.name} value={item}>
                  {item.name}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>

      {selectedAnimal && (
        <Field>
          <FieldLabel>Animal Breed</FieldLabel>
          <Combobox
            items={selectedAnimal.breeds}
            itemToStringLabel={(i) => i.name}
            value={selectedBreed || null}
            onValueChange={(v) => onAnimalBreedSelect(v?.name ?? null)}
          >
            <ComboboxInput showClear placeholder="Select animal breed..." />
            <ComboboxContent>
              <ComboboxEmpty>No breeds found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.name} value={item}>
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      )}
    </FieldSet>
  );
}
