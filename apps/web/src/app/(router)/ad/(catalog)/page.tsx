import { Suspense } from 'react';

import { AdCard, AdList } from '@/features/ad';
import { getNewAds } from '@/shared/api/ads';
import { ErrorComponent } from '@/shared/ui/error-component';
import { AdCatalog, AdCatalogFilters } from '@/widgets/ad-catalog';

async function Page() {
  return (
    <AdCatalog filtersSlot={<AdCatalogFilters />}>
      <Suspense fallback={<div>LOADING</div>}>
        <AdListSection />
      </Suspense>
    </AdCatalog>
  );
}

async function AdListSection() {
  const { data: ads, error } = await getNewAds();
  if (error) return <ErrorComponent {...error} />;

  return (
    <AdList>
      {ads.data.map(ad => (
        <AdCard ad={ad} key={ad.id} />
      ))}
    </AdList>
  );
}

export default Page;
