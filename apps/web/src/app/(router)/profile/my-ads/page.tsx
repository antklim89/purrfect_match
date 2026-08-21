import type { Metadata, Route } from 'next';
import { revalidatePath } from 'next/cache';

import { AdItem } from '@/features/ad';
import { AdDeleteButton } from '@/features/ad-delete';
import { AdPublishButton } from '@/features/ad-publish';
import { getMyAds } from '@/shared/api/ads';
import { getSession } from '@/shared/api/auth';
import { ErrorComponent } from '@/shared/ui/error-component';
import { MyAdsList, MyAdsListEmpty } from '@/widgets/my-ads-list';

export const metadata: Metadata = {
  title: 'My Ads',
};

export default async function Page() {
  const { user } = await getSession();
  if (!user) return <ErrorComponent status={401} message="Authenticate to see this page." />;

  const { data: ads, error } = await getMyAds({ userId: user.id });
  if (error) return <ErrorComponent {...error} />;

  if (ads.data.length === 0) return <MyAdsListEmpty />;
  return (
    <MyAdsList>
      {ads.data.map(ad => (
        <AdItem
          actionsSlot={
            <>
              <AdPublishButton id={ad.id} isPublished={ad.isPublished} onPublish={revalidateAds} />
              <AdDeleteButton id={ad.id} onDelete={revalidateAds} />
            </>
          }
          key={ad.id}
          ad={ad}
        />
      ))}
    </MyAdsList>
  );
}

async function revalidateAds() {
  'use server';
  revalidatePath('/profile/my-ads' satisfies Route, 'page');
}
