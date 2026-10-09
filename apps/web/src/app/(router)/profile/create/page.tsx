import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AdCreateAnimalSelect, AdCreateCard } from '@/features/ad-create';
import { adFindDraftQuery } from '@/shared/api/queries/ad-queries';
import { animalFindManyQuery } from '@/shared/api/queries/animal-queries';
import { loader } from '@/shared/lib/loader';
import { ErrorComponent } from '@/shared/ui/error-component';

export const metadata: Metadata = {
  title: 'Create Ad',
};

export default async function Page() {
  const animalSelectLoader = loader({
    async render() {
      const { data: animals, error } = await animalFindManyQuery();
      if (error) return <ErrorComponent {...error} />;

      return <AdCreateAnimalSelect animals={animals} />;
    },
  });

  return loader({
    props: {
      animalSelect: animalSelectLoader,
    },
    async render({ props: { animalSelect } }) {
      const { data, error } = await adFindDraftQuery();
      if (error?.status === 404) notFound();
      if (error) return <ErrorComponent {...error} />;
      return <AdCreateCard ad={data} animalSelectSlot={animalSelect} />;
    },
  });
}
