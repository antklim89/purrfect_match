import { animals } from '@purrfect_match/shared/entities/animal/constants';
import { cacheLife } from 'next/cache';

import { AdCard, AdCardFallback, AdList } from '@/features/ad';
import { AdFilter } from '@/features/ad-filter';
import { AdSort } from '@/features/ad-sort';
import { AnimalItem } from '@/features/animal';
import { adFindListQuery } from '@/shared/api/queries/ad-queries';
import { loader } from '@/shared/lib/loader';
import { ErrorComponent } from '@/shared/ui/error-component';
import { Pagination } from '@/shared/ui/pagination';
import { AdCatalog } from '@/widgets/ad-catalog';

async function Page(props: PageProps<'/ad'>) {
  const animalLoader = loader({
    ...props,
    // searchParams: props.searchParams,
    // searchParams: Promise.resolve({foo: 'bar'}),
    // props: {foo: 'bar'},
    promises: {
      searchParams: props.searchParams,
    },
    render({ props, promises: { searchParams } }) {
      const animal = animals.find((i) => i.name === searchParams.type);
      console.log('🚀 ~ animal: \n%o\n', searchParams);
      if (!animal) return null;
      return <AnimalItem animal={animal} />;
    },
  });
  const adsListLoader = loader({
    ...props,
    async render({ searchParams }) {
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
    ...props,
    async render({ searchParams }) {
      const { data: ads, error } = await adFindListQuery({ query: searchParams });
      if (error) return <ErrorComponent {...error} />;

      return <Pagination totalPages={ads.pagination.totalPages} page={ads.pagination.currentPage} />;
    },
  });

  return loader({
    props: {
      adsList: adsListLoader,
      pagination: paginationLoader,
      animal: animalLoader,
    },
    async render({ props: { adsList, pagination, animal } }) {
      'use cache';
      cacheLife('max');

      return (
        <section className="w-full max-w-[128rem] mx-auto px-3 my-8">
          <AdCatalog animalSlot={animal} sortSlot={<AdSort />} filtersSlot={<AdFilter />} paginationSlot={pagination}>
            {adsList}
          </AdCatalog>
        </section>
      );
    },
  });
}

export default Page;
