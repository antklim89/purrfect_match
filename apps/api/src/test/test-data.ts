import { faker } from '@faker-js/faker';
import type { User } from 'better-auth';

import type { AdInsertType } from '@/ad/types';

export function createTestUserData(): User {
  const createdAt = faker.date.between({ from: '2001-01-01T00:00:00.000Z', to: '2010-01-01T00:00:00.000Z' });
  const updatedAt = faker.date.future({ refDate: createdAt });
  const name = faker.person.firstName();

  return {
    id: faker.string.nanoid(),
    createdAt,
    updatedAt,
    name,
    email: faker.internet.email({ firstName: name }),
    emailVerified: true,
  };
}

export function createTestAdData(userId: User['id'], data: Partial<AdInsertType> = {}): AdInsertType {
  return {
    id: faker.string.uuid({ version: 7 }),
    name: faker.animal.petName(),
    breed: faker.helpers.arrayElement(['red', 'blue', 'green']),
    type: faker.helpers.arrayElement(['dog', 'cat', 'parrot']),
    description: faker.helpers.arrayElement(['foo bar', 'bar baz', 'foo baz']),
    price: faker.number.float({ min: 10, max: 1000, multipleOf: 0.02 }),
    userId,
    createdAt: faker.date.past({ years: 7 }).toISOString(),
    isPublished: faker.datatype.boolean(),
    ...data,
  };
}
