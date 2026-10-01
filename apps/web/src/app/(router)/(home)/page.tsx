import { cacheLife } from 'next/cache';

import { AdCard, AdCardFallback, AdList } from '@/features/ad';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { adFindNewListQuery } from '@/shared/api/queries/ad-queries';
import { loader } from '@/shared/lib/loader';
import { ErrorComponent } from '@/shared/ui/error-component';
import { Hero } from '@/widgets/hero';

async function Page() {
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
    },
    async render({ props: { newAds } }) {
      'use cache';
      cacheLife('max');

      return (
        <>
          <Hero />
          <section className="container my-4">{newAds}</section>
        </>
      );
    },
  });
}

export default Page;
