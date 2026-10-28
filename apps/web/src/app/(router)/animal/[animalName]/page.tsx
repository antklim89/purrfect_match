import { cacheLife } from 'next/cache';

import { AnimalSection } from '@/features/animal';
import { animalFindOneQuery } from '@/shared/api/queries/animal-queries';
import { ErrorComponent } from '@/shared/ui/error-component';

export default async function Page({ params }: PageProps<'/animal/[animalName]'>) {
  'use cache';
  cacheLife('max');

  const { animalName } = await params;
  const { data: animal, error } = await animalFindOneQuery({ name: animalName });
  if (error) return <ErrorComponent {...error} />;

  return <AnimalSection animal={animal} />;
}
