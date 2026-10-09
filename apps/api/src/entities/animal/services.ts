import { StatusCode } from '@purrfect_match/shared/models/status-codes';
import { HTTPException } from 'hono/http-exception';

import { db } from '@/lib/db';

export async function animalFindManyService() {
  const animals = await db.query.animalTypeTable.findMany({
    with: { breeds: { columns: { name: true } } },
  });

  return animals;
}

export async function animalFindOneService({ name }: { name: string }) {
  const animal = await db.query.animalTypeTable.findFirst({
    where: { name },
    with: { breeds: { columns: { name: true } } },
  });

  if (!animal) throw new HTTPException(StatusCode.NOT_FOUND, { message: `Animal with name ${name} not found.` });
  return animal;
}
