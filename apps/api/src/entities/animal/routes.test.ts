import { testClient } from 'hono/testing';
import { describe, expect, it } from 'vitest';

import app from '@/app';
import { testApiCall } from '@/test/api-call';
import { insertAnimalBreed, insertAnimalType } from '@/test/insert-data';

const client = testClient(app);

describe('[GET] /api/animal', () => {
  it('should find animal types', async () => {
    const insertedAnimalType = await insertAnimalType();
    const insertedBreed1 = await insertAnimalBreed({ type: insertedAnimalType });
    const insertedBreed2 = await insertAnimalBreed({ type: insertedAnimalType });

    const { data } = await testApiCall(client.api.animal.$get());

    expect(data).toHaveLength(1);
    expect(data).toStrictEqual([
      {
        name: insertedAnimalType.name,
        imageUrl: insertedAnimalType.imageUrl,
        description: insertedAnimalType.description,
        breeds: [{ name: insertedBreed1.name }, { name: insertedBreed2.name }],
      },
    ]);
  });
});

describe('[GET] /api/animal/:name', () => {
  it('should find animal by name', async () => {
    const insertedAnimalType = await insertAnimalType();
    const insertedBreed1 = await insertAnimalBreed({ type: insertedAnimalType });
    const insertedBreed2 = await insertAnimalBreed({ type: insertedAnimalType });

    const { data } = await testApiCall(client.api.animal[':name'].$get({ param: { name: insertedAnimalType.name } }));

    expect(data).toStrictEqual({
      name: insertedAnimalType.name,
      animalNames: [insertedAnimalType.name],
      imageUrl: insertedAnimalType.imageUrl,
      description: insertedAnimalType.description,
      breeds: [
        { name: insertedBreed1.name, description: insertedBreed1.description },
        { name: insertedBreed2.name, description: insertedBreed2.description },
      ],
    });
  });
});
