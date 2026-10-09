import { cacheLife } from 'next/cache';

import { AdCard, AdCardFallback, AdList } from '@/features/ad';
import { AnimalItem, AnimalsList } from '@/features/animal';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { adFindNewListQuery } from '@/shared/api/queries/ad-queries';
import { animalFindManyQuery } from '@/shared/api/queries/animal-queries';
import { loader } from '@/shared/lib/loader';
import { ErrorComponent } from '@/shared/ui/error-component';
import { Hero } from '@/widgets/hero';

async function Page() {
  const animalLoader = loader({
    async render() {
      'use cache';
      cacheLife('max');
      const { data: animalsTypes, error } = await animalFindManyQuery();
      if (error) return <ErrorComponent {...error} />;

      return (
        <AnimalsList>
          {animalsTypes.map((animal) => (
            <AnimalItem key={animal.name} animal={animal} />
          ))}
        </AnimalsList>
      );
    },
  });

  const newAdsLoader = loader({
    async render() {
      const { data: ads, error } = await adFindNewListQuery();
      if (error) return <ErrorComponent {...error} />;

      return (
        <AdList>
          {ads.items.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              actionSlot={<ToggleFavoriteButton inFavorites={ad.inFavorites} adId={ad.id} />}
            />
          ))}
        </AdList>
      );
    },
    fallback: (
      <AdList>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <AdCardFallback key={i} />
        ))}
      </AdList>
    ),
  });

  return loader({
    props: {
      newAds: newAdsLoader,
      animals: animalLoader,
    },
    async render({ props: { newAds, animals } }) {
      'use cache';
      cacheLife('max');

      return (
        <>
          <Hero />
          <section className="container my-4">{animals}</section>
          <section className="container my-4">{newAds}</section>
        </>
      );
    },
  });
}

export default Page;
