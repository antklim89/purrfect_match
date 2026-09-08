import { AdCard, AdList } from '@/features/ad';
import { adFindNewListQuery } from '@/shared/api/queries/ad-queries';
import { ErrorComponent } from '@/shared/ui/error-component';

export default async function Page() {
  'use cache';

  const { data: ads, error } = await adFindNewListQuery();
  if (error) return <ErrorComponent {...error} />;

  return (
    <AdList>
      {ads.items.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </AdList>
  );
}
