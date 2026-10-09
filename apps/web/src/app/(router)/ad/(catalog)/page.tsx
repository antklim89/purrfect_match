import { cacheLife } from 'next/cache';

import { AdCard, AdCardFallback, AdList } from '@/features/ad';
import { AdAnimalSelect, AdFilter } from '@/features/ad-filter';
import { AdSort } from '@/features/ad-sort';
import { adFindListQuery } from '@/shared/api/queries/ad-queries';
import { animalFindManyQuery } from '@/shared/api/queries/animal-queries';
import { loader } from '@/shared/lib/loader';
import { ErrorComponent } from '@/shared/ui/error-component';
import { Pagination } from '@/shared/ui/pagination';
import { AdCatalog } from '@/widgets/ad-catalog';

async function Page(props: PageProps<'/ad'>) {
  const animalSelectLoader = loader({
    key: 'animal loader',
    async render() {
      const { data: animals, error } = await animalFindManyQuery();
      if (error) return <ErrorComponent {...error} />;

      return <AdAnimalSelect animals={animals} />;
    },
  });

  const adsListLoader = loader({
    promises: {
      searchParams: props.searchParams,
    },
    async render({ promises: { searchParams } }) {
      const { data: ads, error } = await adFindListQuery({ query: searchParams });
      if (error) return <ErrorComponent {...error} />;

      return (
        <AdList>
          {ads.items.map((ad) => (
            <AdCard ad={ad} key={ad.id} />
          ))}
        </AdList>
      );
    },
    fallback: (
      <AdList>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <AdCardFallback key={i} />
        ))}
      </AdList>
    ),
  });

  const paginationLoader = loader({
    promises: {
      searchParams: props.searchParams,
    },
    async render({ promises: { searchParams } }) {
      const { data: ads, error } = await adFindListQuery({ query: searchParams });
      if (error) return <ErrorComponent {...error} />;

      return <Pagination totalPages={ads.pagination.totalPages} page={ads.pagination.currentPage} />;
    },
  });

  return loader({
    props: {
      adsList: adsListLoader,
      pagination: paginationLoader,
      animalSelect: animalSelectLoader,
    },
    async render({ props: { adsList, pagination, animalSelect } }) {
      'use cache';
      cacheLife('max');

      return (
        <section className="w-full max-w-[128rem] mx-auto px-3 my-8">
          <AdCatalog
            sortSlot={<AdSort />}
            filtersSlot={<AdFilter filtersSlot={animalSelect} />}
            paginationSlot={pagination}
          >
            {adsList}
          </AdCatalog>
        </section>
      );
    },
  });
}

export default Page;
