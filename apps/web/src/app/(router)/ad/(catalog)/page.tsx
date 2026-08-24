import { Suspense } from 'react';

import { AdCard, AdList } from '@/features/ad';
import { getAds } from '@/shared/api/ads';
import { ErrorComponent } from '@/shared/ui/error-component';
import { AdCatalog, AdCatalogFilters } from '@/widgets/ad-catalog';

async function Page(props: PageProps<'/ad'>) {
  return (
    <AdCatalog filtersSlot={<AdCatalogFilters />}>
      <Suspense fallback={<div>LOADING</div>}>
        <AdListSection {...props} />
      </Suspense>
    </AdCatalog>
  );
}

async function AdListSection({ searchParams }: PageProps<'/ad'>) {
  const query = await searchParams;

  const { data: ads, error } = await getAds({ query });
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
