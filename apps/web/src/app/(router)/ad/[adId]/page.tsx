import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AdDescription, AdImages, AdInfo } from '@/features/ad';
import { adFindOneQuery } from '@/shared/api/queries/ad-queries';
import notFoundFallback from '@/shared/assets/not-found.png';
import { ErrorComponent } from '@/shared/ui/error-component';
import { AdSection, AdSectionContent, AdSectionDescription } from '@/widgets/ad-section';

export async function generateMetadata({ params }: PageProps<'/ad/[adId]'>): Promise<Metadata> {
  'use cache';

  const { adId } = await params;
  const { error, data: ad } = await adFindOneQuery({ id: adId });
  if (error) return { title: 'Error', description: error.message };

  const image = ad.images[0] ? ad.images[0].url : notFoundFallback.src;

  return {
    title: `${ad.name} ${ad.type} ${ad.breed}`,
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
  const { error, data: ad } = await adFindOneQuery({ id: adId });
  if (error?.status === 404) notFound();
  if (error) return <ErrorComponent {...error} />;

  return (
    <AdSection>
      <AdSectionContent>
        <AdImages ad={ad} />
        <AdInfo ad={ad} />
      </AdSectionContent>
      <AdSectionDescription>
        <AdDescription ad={ad} />
      </AdSectionDescription>
    </AdSection>
  );
}
