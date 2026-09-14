import { adFindListQuery } from '@/shared/api/queries/ad-queries';
import { ErrorComponent } from '@/shared/ui/error-component';
import { Pagination } from '@/shared/ui/pagination';

async function Page({ searchParams }: { searchParams: Awaited<PageProps<'/ad'>['searchParams']> }) {
  'use cache';
  const { data: ads, error } = await adFindListQuery({ query: searchParams });
  if (error) return <ErrorComponent {...error} />;

  return <Pagination totalPages={ads.pagination.totalPages} page={ads.pagination.currentPage} />;
}

export default Page;
