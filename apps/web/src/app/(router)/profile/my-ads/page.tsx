import type { Metadata } from 'next';

import { AdItem } from '@/features/ad';
import { AdDeleteButton } from '@/features/ad-delete';
import { AdPublishButton } from '@/features/ad-publish';
import { adFindMyListQuery } from '@/shared/api/queries/ad-queries';
import { getSession } from '@/shared/api/queries/auth-queries';
import { ErrorComponent } from '@/shared/ui/error-component';
import { MyAdsList, MyAdsListEmpty } from '@/widgets/my-ads-list';

export const metadata: Metadata = {
  title: 'My Ads',
};

export default async function Page() {
  const { user } = await getSession();
  if (!user) return <ErrorComponent status={401} message="Authenticate to see this page." />;

  const { data: ads, error } = await adFindMyListQuery({ userId: user.id });
  if (error) return <ErrorComponent {...error} />;

  if (ads.items.length === 0) return <MyAdsListEmpty />;
  return (
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
  );
}
