import { faker } from '@faker-js/faker';
import type { User } from 'better-auth';

import type { AdImageInsertType, AdInsertType } from '@/entities/ad/types';
import type { AnimalBreedInsertType, AnimalTypeInsertType } from '@/entities/animal/types';

export function createTestUserData(): User {
  const createdAt = faker.date.between({ from: '2001-01-01T00:00:00.000Z', to: '2010-01-01T00:00:00.000Z' });
  const updatedAt = faker.date.future({ refDate: createdAt });
  const name = faker.person.firstName();

  return {
    id: faker.string.uuid({ version: 7 }),
    createdAt,
    updatedAt,
    name,
    email: faker.internet.email({ firstName: name }),
    emailVerified: true,
  };
}

export function createTestAdData({
  ad,
  breedName,
  userId,
}: {
  ad: Partial<Omit<AdInsertType, 'userId' | 'breedName'>>;
  userId: string;
  breedName: string;
}): AdInsertType {
  return {
    id: faker.string.uuid({ version: 7 }),
    birth: '2000-01-01',
    gender: faker.helpers.arrayElement(['male', 'female']),
    breedName,
    userId,
    name: faker.person.firstName(),
    description: faker.helpers.arrayElement([
      'foo bar Lorem ipsum dolor',
      'bar baz Lorem ipsum dolor',
      'foo baz Lorem ipsum dolor',
    ]),
    price: faker.number.float({ min: 10, max: 1000, multipleOf: 0.02 }),
    createdAt: faker.date.past({ years: 7 }).toISOString(),
    status: 'PUBLISHED',
    ...ad,
  };
}

export function createTestAdImageData({
  adImage,
  adId,
}: {
  adId: string;
  adImage?: Partial<AdImageInsertType>;
}): AdImageInsertType {
  return {
    id: faker.string.uuid(),
    adId,
    url: faker.image.url(),
    blurDataUrl: faker.image.dataUri(),
    ...adImage,
  };
}

export function createTestAnimalTypeData(data: Partial<AnimalTypeInsertType> = {}): AnimalTypeInsertType {
  return {
    name: faker.string.uuid(),
    description: faker.lorem.text(),
    imageUrl: faker.image.url(),
    ...data,
  };
}

export function createTestAnimalBreedData({
  animalTypeName,
  breed = {},
}: {
  animalTypeName: string;
  breed?: Partial<Omit<AnimalBreedInsertType, 'animalTypeName'>>;
}): AnimalBreedInsertType {
  return {
    name: faker.string.uuid(),
    description: faker.lorem.text(),
    animalTypeName,
    ...breed,
  };
}
