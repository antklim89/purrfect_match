import { cache } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { ProfileUpdateCard } from '@/features/profile-update';
import { apiClient, apiParse } from '@/shared/lib/api-client';
import { ErrorComponent } from '@/shared/ui/error-component';

const getProfile = cache(async () => {
  const headersStore = await headers();
  return await apiParse(
    apiClient.api.auth['get-profile'].$get(undefined, { headers: Object.fromEntries(headersStore.entries()) }),
  );
});

export async function generateMetadata(): Promise<Metadata> {
  const { result, error } = await getProfile();
  if (error) return { title: 'Error' };

  return {
    title: `${result.fullName || 'User'}'s Profile`,
    description: result.description,
  };
}

export default async function Page() {
  const { result, error } = await getProfile();
  if (error) return <ErrorComponent {...error} />;
  return <ProfileUpdateCard user={result} />;
}
