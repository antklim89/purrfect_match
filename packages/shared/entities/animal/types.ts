import type { animals } from './constants';

export type AnimalTypes = (typeof animals)[number]['name'];
export type AnimalBreeds = Record<AnimalTypes, string[]>;

export interface AnimalBreed {
  name: string;
  description: string;
}

export interface AnimalType {
  name: string;
  image: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  description: string;
  breeds: AnimalBreed[];
}
