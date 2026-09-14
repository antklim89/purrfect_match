import { Suspense } from 'react';

import { AdFilter } from '@/features/ad-filter';
import { AdCatalog } from '@/widgets/ad-catalog';
import AdsListSectionLoading from './_ads-list/loading';
import AdsListSection from './_ads-list/page';
import AdsPaginationSection from './_ads-pagination/page';

async function Page(props: PageProps<'/ad'>) {
  const searchParams = await props.searchParams;
  return (
    <section className="w-full max-w-[128rem] mx-auto px-3 my-8">
      <AdCatalog
        filtersSlot={<AdFilter />}
        paginationSlot={
          <Suspense>
            <AdsPaginationSection searchParams={searchParams} />
          </Suspense>
        }
      >
        <Suspense fallback={<AdsListSectionLoading />}>
          <AdsListSection searchParams={searchParams} />
        </Suspense>
      </AdCatalog>
    </section>
  );
}

export default Page;
