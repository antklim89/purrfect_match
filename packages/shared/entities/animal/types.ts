import type { animals } from './constants';

export type AnimalTypes = keyof typeof animals;
export type AnimalBreeds = Record<AnimalTypes, string[]>;

export interface AnimalBreed {
  name: string;
  description: string;
}

export interface AnimalType {
  description: string;
  breeds: AnimalBreed[];
}

export type AnimalCatalog = Record<string, AnimalType>;
