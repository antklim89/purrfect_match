import { testClient } from 'hono/testing';
import { describe, expect, it } from 'vitest';

import app from '@/app';
import { testApiCall } from '@/test/api-call';
import { insertData } from '@/test/insert-data';
import { createTestAnimalBreedData, createTestAnimalTypeData } from '@/test/test-data';
import { animalBreedTable, animalTypeTable } from './tables';

const client = testClient(app);

describe('[GET] /api/animal', () => {
  it('should find animal types', async () => {
    const insertedAnimalType = await insertData(animalTypeTable, createTestAnimalTypeData());
    const insertedBreed1 = await insertData(animalBreedTable, createTestAnimalBreedData(insertedAnimalType.name));
    const insertedBreed2 = await insertData(animalBreedTable, createTestAnimalBreedData(insertedAnimalType.name));

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

  it('should find animal by name', async () => {
    const insertedAnimalType = await insertData(animalTypeTable, createTestAnimalTypeData());
    const insertedBreed1 = await insertData(animalBreedTable, createTestAnimalBreedData(insertedAnimalType.name));
    const insertedBreed2 = await insertData(animalBreedTable, createTestAnimalBreedData(insertedAnimalType.name));

    const { data } = await testApiCall(client.api.animal[':name'].$get({ param: { name: insertedAnimalType.name } }));

    expect(data).toStrictEqual({
      name: insertedAnimalType.name,
      imageUrl: insertedAnimalType.imageUrl,
      description: insertedAnimalType.description,
      breeds: [{ name: insertedBreed1.name }, { name: insertedBreed2.name }],
    });
  });
});
