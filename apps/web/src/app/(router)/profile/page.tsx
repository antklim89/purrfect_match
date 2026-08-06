import { headers } from 'next/headers';

import { UserInfoUpdateCard } from '@/features/user-info-update';
import { apiClient, apiParse } from '@/shared/lib/api-client';
import { ErrorComponent } from '@/shared/ui/error-component';

export default async function Page() {
  const headersStore = await headers();
  const { result, error } = await apiParse(
    apiClient.api.auth['get-profile'].$get(undefined, { headers: Object.fromEntries(headersStore.entries()) }),
  );
  if (error) return <ErrorComponent {...error} />;

  return <UserInfoUpdateCard user={result} />;
}
