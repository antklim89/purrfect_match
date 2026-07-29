import { cacheLife } from 'next/cache';

import { AdCard, AdList } from '@/features/ad';
import { apiClient, apiParse } from '@/shared/lib/apiClient';
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

  const { result: ads, error } = await apiParse(
    apiClient.api.ad.$get({ query: { limit: '6', sortBy: 'createdAt', orderBy: 'desc' } }),
  );
  if (error) return <ErrorComponent {...error} />;

  return (
    <AdList>
      {ads.data.map(ad => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </AdList>
  );
}
