import type { Route } from 'next';
import { Trash2Icon } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { headers as getHeaders } from 'next/headers';

import { AdItem } from '@/features/ad/ui/ad-item';
import { AdDeleteButton } from '@/features/ad-delete';
import { apiCall, apiClient } from '@/shared/lib/api-client';
import { authClient } from '@/shared/lib/auth-client';
import { Button } from '@/shared/ui/button';
import { ErrorComponent } from '@/shared/ui/error-component';
import { MyAdsList, MyAdsListEmpty } from '@/widgets/my-ads-list';

export default async function Page() {
  const headers = await getHeaders();
  const { data } = await authClient.getSession({ fetchOptions: { headers: headers } });
  if (!data?.user) return <ErrorComponent status={401} message="Authenticate to see this page." />;

  const { data: ads, error } = await apiCall(
    apiClient.api.ad.$get(
      { query: { userId: data.user.id, limit: '50', sortBy: 'createdAt', orderBy: 'desc' } },
      { headers: Object.fromEntries(headers.entries()) },
    ),
  );
  if (error) return <ErrorComponent {...error} />;

  if (ads.data.length === 0) return <MyAdsListEmpty />;
  return (
    <MyAdsList>
      {ads.data.map(ad => (
        <AdItem
          actionsSlot={
            <AdDeleteButton
              id={ad.id}
              aria-label="delete ad"
              onDelete={async () => {
                'use server';
                revalidatePath('/profile/my-ads' satisfies Route, 'page');
              }}
              render={
                <Button variant="destructive">
                  <Trash2Icon />
                </Button>
              }
            />
          }
          key={ad.id}
          ad={ad}
        />
      ))}
    </MyAdsList>
  );
}
