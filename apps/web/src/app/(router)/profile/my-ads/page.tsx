import type { Metadata } from 'next';

import { AdItem } from '@/features/ad';
import { AdDeleteButton } from '@/features/ad-delete';
import { AdPublishButton } from '@/features/ad-publish';
import { AdSort } from '@/features/ad-sort';
import { adFindMyListQuery } from '@/shared/api/queries/ad-queries';
import { getSession } from '@/shared/api/queries/auth-queries';
import { ErrorComponent } from '@/shared/ui/error-component';
import { Pagination } from '@/shared/ui/pagination';
import { AdCatalog } from '@/widgets/ad-catalog';
import { MyAdsList, MyAdsListEmpty } from '@/widgets/my-ads-list';

export const metadata: Metadata = {
  title: 'My Ads',
};

export default async function Page({ searchParams }: PageProps<'/profile/my-ads'>) {
  const query = await searchParams;
  const { user } = await getSession();
  if (!user) return <ErrorComponent status={401} message="Authenticate to see this page." />;

  const { data: ads, error } = await adFindMyListQuery({ userId: user.id, query });
  if (error) return <ErrorComponent {...error} />;

  if (ads.items.length === 0) return <MyAdsListEmpty />;
  return (
    <AdCatalog
      sortSlot={<AdSort />}
      paginationSlot={<Pagination totalPages={ads.pagination.totalPages} page={ads.pagination.currentPage} />}
    >
      <MyAdsList>
        {ads.items.map((ad) => (
          <AdItem
            actionsSlot={
              <>
                <AdPublishButton id={ad.id} status={ad.status} />
                <AdDeleteButton id={ad.id} />
              </>
            }
            key={ad.id}
            ad={ad}
          />
        ))}
      </MyAdsList>
    </AdCatalog>
  );
}
