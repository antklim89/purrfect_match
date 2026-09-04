import { Suspense } from 'react';

import { AdCard, AdList } from '@/features/ad';
import { AdFilter } from '@/features/ad-filter';
import { getAds } from '@/shared/api/ads';
import { ErrorComponent } from '@/shared/ui/error-component';
import { AdCatalog } from '@/widgets/ad-catalog';

async function Page(props: PageProps<'/ad'>) {
  return (
    <section className="w-full max-w-[128rem] mx-auto px-3 my-8">
      <AdCatalog filtersSlot={<AdFilter />}>
        <Suspense fallback={<div>LOADING</div>}>
          <AdListSection {...props} />
        </Suspense>
      </AdCatalog>
    </section>
  );
}

async function AdListSection({ searchParams }: PageProps<'/ad'>) {
  const query = await searchParams;

  const { data: ads, error } = await getAds({ query });
  if (error) return <ErrorComponent {...error} />;

  return (
    <AdList>
      {ads.items.map((ad) => (
        <AdCard ad={ad} key={ad.id} />
      ))}
    </AdList>
  );
}

export default Page;
