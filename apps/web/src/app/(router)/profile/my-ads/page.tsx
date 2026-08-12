import { headers } from 'next/headers';

import { AdItem } from '@/features/ad/ui/ad-item';
import { apiCall, apiClient } from '@/shared/lib/api-client';
import { authClient } from '@/shared/lib/auth-client';
import { ErrorComponent } from '@/shared/ui/error-component';
import { MyAdsList } from '@/widgets/my-ads-list';

export default async function Page() {
  const { data } = await authClient.getSession({ fetchOptions: { headers: await headers() } });
  if (!data?.user) return <ErrorComponent status={401} message="Authenticate to see this page." />;

  const { data: ads, error } = await apiCall(
    apiClient.api.ad.$get({ query: { userId: data.user.id, limit: '50', sortBy: 'createdAt', orderBy: 'desc' } }),
  );
  if (error) return <ErrorComponent {...error} />;

  return (
    <MyAdsList>
      {ads.data.map(ad => (
        <AdItem actionsSlot={null} key={ad.id} ad={ad} />
      ))}
    </MyAdsList>
  );
}
