import { faker } from '@faker-js/faker';
import { animalBreeds, animalTypes } from '@purrfect_match/shared/entities/animal/constants';
import type { User } from 'better-auth';

import type { AdInsertType } from '@/entities/ad/types';

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
  const type = faker.helpers.arrayElement(animalTypes);
  const breed = faker.helpers.arrayElement(animalBreeds[type]);

  return {
    id: faker.string.uuid({ version: 7 }),
    name: animalTypes[0] as string,
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
