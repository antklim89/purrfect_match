import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AdCreateCard } from '@/features/ad-create';
import { getDraftAd } from '@/shared/api/ads';
import { ErrorComponent } from '@/shared/ui/error-component';

export const metadata: Metadata = {
  title: 'Create Ad',
};

export default async function Page() {
  const { data, error } = await getDraftAd();
  if (error?.status === 404) notFound();
  if (error) return <ErrorComponent {...error} />;
  return <AdCreateCard ad={data} />;
}
