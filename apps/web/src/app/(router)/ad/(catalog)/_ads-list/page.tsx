import { AdCard, AdList } from '@/features/ad';
import { adFindListQuery } from '@/shared/api/queries/ad-queries';
import { ErrorComponent } from '@/shared/ui/error-component';

async function Page({ searchParams }: { searchParams: Awaited<PageProps<'/ad'>['searchParams']> }) {
  'use cache';
  const { data: ads, error } = await adFindListQuery({ query: searchParams });
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
