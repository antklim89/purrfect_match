import { cache } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { ProfileUpdateCard } from '@/features/profile-update';
import { apiCall, apiClient } from '@/shared/lib/api-client';
import { ErrorComponent } from '@/shared/ui/error-component';

const getProfile = cache(async () => {
  const headersStore = await headers();
  return await apiCall(
    apiClient.api.auth['get-profile'].$get(undefined, { headers: Object.fromEntries(headersStore.entries()) }),
  );
});

export async function generateMetadata(): Promise<Metadata> {
  const { data, error } = await getProfile();
  if (error) return { title: 'Error' };

  return {
    title: `${data.fullName || 'User'}'s Profile`,
    description: data.description,
  };
}

export default async function Page() {
  const { data, error } = await getProfile();
  if (error?.status === 404) notFound();
  if (error) return <ErrorComponent {...error} />;
  return <ProfileUpdateCard user={data} />;
}
