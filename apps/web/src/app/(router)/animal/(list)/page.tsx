import { cacheLife } from 'next/cache';

import { AnimalItem, AnimalsList } from '@/features/animal';
import { animalFindManyQuery } from '@/shared/api/queries/animal-queries';
import { ErrorComponent } from '@/shared/ui/error-component';

export default async function Page() {
  'use cache';
  cacheLife('max');

  const { data: animals, error } = await animalFindManyQuery();
  if (error) return <ErrorComponent {...error} />;

  return (
    <div className="container">
      <AnimalsList>
        {animals.map((animal) => (
          <AnimalItem animal={animal} key={animal.name} />
        ))}
      </AnimalsList>
    </div>
  );
}
