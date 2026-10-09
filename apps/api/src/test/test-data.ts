import { faker } from '@faker-js/faker';
import type { User } from 'better-auth';

import type { AdInsertType } from '@/entities/ad/types';
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

export function createTestAdData(userId: User['id'], data: Partial<AdInsertType> = {}): AdInsertType {
  const breed = faker.animal.dog();
  const type = faker.helpers.arrayElement(['Dog', 'Cat', 'Bird', 'Fish', 'Rodent', 'Exotic']);

  return {
    id: faker.string.uuid({ version: 7 }),
    name: type,
    breed,
    type,
    description: faker.helpers.arrayElement([
      'foo bar Lorem ipsum dolor',
      'bar baz Lorem ipsum dolor',
      'foo baz Lorem ipsum dolor',
    ]),
    price: faker.number.float({ min: 10, max: 1000, multipleOf: 0.02 }),
    userId,
    createdAt: faker.date.past({ years: 7 }).toISOString(),
    status: 'PUBLISHED',
    ...data,
  };
}

export function createTestAnimalTypeData(data: Partial<AnimalTypeInsertType> = {}): AnimalTypeInsertType {
  return {
    name: faker.animal.type(),
    description: faker.lorem.text(),
    imageUrl: faker.image.url(),
    ...data,
  };
}
export function createTestAnimalBreedData(
  animalTypeName: string,
  data: Partial<AnimalBreedInsertType> = {},
): AnimalBreedInsertType {
  return {
    name: faker.animal.petName(),
    description: faker.lorem.text(),
    animalTypeName,
    ...data,
  };
}
