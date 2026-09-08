import { Suspense } from 'react';

import { AdFilter } from '@/features/ad-filter';
import { AdCatalog } from '@/widgets/ad-catalog';
import AdListSectionLoading from './_ads-list/loading';
import AdListSection from './_ads-list/page';

async function Page(props: PageProps<'/ad'>) {
  const searchParams = await props.searchParams;

  return (
    <section className="w-full max-w-[128rem] mx-auto px-3 my-8">
      <AdCatalog filtersSlot={<AdFilter />}>
        <Suspense fallback={<AdListSectionLoading />}>
          <AdListSection searchParams={searchParams} />
        </Suspense>
      </AdCatalog>
    </section>
  );
}

export default Page;
