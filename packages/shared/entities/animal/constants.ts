import birdImage from './assets/bird-card.webp';
import catImage from './assets/cat-card.webp';
import dogImage from './assets/dog-card.webp';
import fishImage from './assets/fish-card.webp';
import rabbitImage from './assets/rabbit-card.webp';
import turtleImage from './assets/turtle-card.webp';
import type { AnimalBreeds, AnimalType, AnimalTypes } from './types';
export const animals = [
  {
    name: 'cat',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    image: catImage,
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
  {
    name: 'dog',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    image: dogImage,
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
  {
    name: 'bird',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    image: birdImage,
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
  {
    name: 'fish',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    image: fishImage,
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
  {
    name: 'rabbit',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    image: rabbitImage,
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
  {
    name: 'turtle',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, laudantium?',
    image: turtleImage,
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
] as const satisfies AnimalType[];

export const animalTypes = animals.map((i) => i.name) as AnimalTypes[];
export const animalBreeds = Object.fromEntries(
  animals.map((animal) => [animal.name, animal.breeds.map((i) => i.name)]),
) as AnimalBreeds;
