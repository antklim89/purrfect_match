import { cache } from 'react';
import type { Metadata } from 'next';

import { AdDescription, AdImages, AdInfo } from '@/features/ad';
import adCardFallback from '@/shared/assets/ad-card-fallback.jpg';
import { apiClient, apiParse } from '@/shared/lib/api-client';
import { ErrorComponent } from '@/shared/ui/error-component';
import { AdSection } from '@/widgets/ad-section';

const getAd = cache(async ({ id }: { id: string }) => {
  return await apiParse(apiClient.api.ad[':id'].$get({ param: { id } }));
});

export async function generateMetadata({ params }: PageProps<'/ad/[adId]'>): Promise<Metadata> {
  const { adId } = await params;
  const { error, result: ad } = await getAd({ id: adId });
  if (error) return { title: 'Error', description: error.message };

  const image = ad.images[0] ? `/media${ad.images[0].url}` : adCardFallback.src;

  return {
    title: `${ad.name} ${ad.type}`,
    description: ad.description,
    openGraph: {
      title: `${ad.name} ${ad.type}`,
      description: ad.description,
      images: image,
    },
    twitter: {
      title: `${ad.name} ${ad.type}`,
      description: ad.description,
      images: image,
    },
  };
}

export default async function Page({ params }: PageProps<'/ad/[adId]'>) {
  'use cache';

  const { adId } = await params;
  const { error, result: ad } = await getAd({ id: adId });
  if (error) return <ErrorComponent {...error} />;

  return (
    <AdSection
      descriptionSlot={<AdDescription ad={ad} />}
      imagesSlot={<AdImages ad={ad} />}
      infoSlot={<AdInfo ad={ad} />}
    />
  );
}
