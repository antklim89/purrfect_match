import type { AnimalBreeds, AnimalCatalog, AnimalTypes } from './types';

export const animals = {
  cat: {
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    breeds: [
      {
        name: 'Somali',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Regamuffin',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Tiffanie',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'California Spangled',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Chartreux',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
    ],
  },
  dog: {
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    breeds: [
      {
        name: 'Chigi',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Yorkie Apso',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Maltese',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Shilon Shepherd',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Carolina Dog',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
    ],
  },
  bird: {
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    breeds: [
      {
        name: 'Palm Cockadtoo',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Mealy Amazon',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Kakariki',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Plain Parakeet',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Patagonian Conure',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
    ],
  },
  fish: {
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    breeds: [
      {
        name: 'Knifefish',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Pacu',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Rabbitfish',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Batfish',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Arowana',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
    ],
  },
  rabbit: {
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    breeds: [
      {
        name: 'Jersey Wooly',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Polish',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'French Angora',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'American',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Silver',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
    ],
  },
  turtle: {
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    breeds: [
      {
        name: 'Russian Tortoise',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Razorback Musk',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Black Wood',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: "Reeve's Turtle",
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
      {
        name: 'Western Painted',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
      },
    ],
  },
} as const satisfies AnimalCatalog;

export const animalTypes = Object.keys(animals) as AnimalTypes[];
export const animalBreeds = Object.entries(animals).reduce<Record<AnimalTypes, string[]>>(
  (acc, [key, value]) => {
    acc[key as AnimalTypes] = value.breeds.map(i => i.name);
    return acc;
  },
  {
    bird: [],
    fish: [],
    rabbit: [],
    turtle: [],
    cat: [],
    dog: [],
  },
);

export const x = Object.fromEntries(
  Object.entries(animals).map(([key, value]) => [key, value.breeds.map(i => i.name)]),
) as AnimalBreeds;
