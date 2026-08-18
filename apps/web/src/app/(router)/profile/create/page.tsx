import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { AdCreateCard } from '@/features/ad-create';
import { getProfile } from '@/shared/api/profiles';
import { ErrorComponent } from '@/shared/ui/error-component';

export const metadata: Metadata = {
  title: 'Create Ad',
};

export default async function Page() {
  const { data, error } = await getProfile({ headers: await headers() });
  if (error?.status === 404) notFound();
  if (error) return <ErrorComponent {...error} />;
  return <AdCreateCard profile={data} />;
}
