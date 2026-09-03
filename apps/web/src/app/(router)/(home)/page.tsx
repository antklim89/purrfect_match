import { cacheLife } from 'next/cache';

import { AdCard, AdList } from '@/features/ad';
import { getNewAds } from '@/shared/api/ads';
import { ErrorComponent } from '@/shared/ui/error-component';
import { Hero } from '@/widgets/hero';

function Page() {
  return (
    <>
      <Hero />
      <section className="container my-4">
        <AdsSection />
      </section>
    </>
  );
}

export default Page;

async function AdsSection() {
  'use cache';
  cacheLife('hours');

  const { data: ads, error } = await getNewAds();
  if (error) return <ErrorComponent {...error} />;

  return (
    <AdList>
      {ads.items.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </AdList>
  );
}
