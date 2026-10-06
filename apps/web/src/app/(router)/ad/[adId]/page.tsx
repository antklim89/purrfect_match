import type { Metadata } from 'next';

import {
  AdDescription,
  AdDescriptionFallback,
  AdImages,
  AdImagesFallback,
  AdInfo,
  AdInfoFallback,
} from '@/features/ad';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { adFindOneQuery } from '@/shared/api/queries/ad-queries';
import notFoundFallback from '@/shared/assets/not-found.png';
import { apiCall, apiSessionClient } from '@/shared/lib/api-client';
import { loader } from '@/shared/lib/loader';
import { Button } from '@/shared/ui/button';
import { ErrorComponent } from '@/shared/ui/error-component';
import { Spinner } from '@/shared/ui/spinner';
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

export default async function Page(props: PageProps<'/ad/[adId]'>) {
  const favoriteButtonLoader = loader({
    promises: { params: props.params },
    key: 'favorite button',
    render: async ({ promises: { params } }) => {
      const { data: favorite } = await apiCall(
        apiSessionClient.api.ad[':adId'].favorite.$get({ param: { adId: params.adId } }),
      );
      return <ToggleFavoriteButton adId={params.adId} inFavorites={favorite != null} />;
    },
    fallback: (
      <Button variant="outline" size="icon-lg">
        <Spinner />
      </Button>
    ),
  });

  return loader({
    promises: { params: props.params },
    props: {
      favoriteButton: favoriteButtonLoader,
    },
    render: async ({ promises: { params }, props: { favoriteButton } }) => {
      'use cache';

      const { error, data: ad } = await adFindOneQuery({ id: params.adId });
      if (error) return <ErrorComponent {...error} />;

      return (
        <AdSection>
          <AdSectionContent>
            <AdImages ad={ad} />
            <AdInfo ad={ad} actionsSlot={favoriteButton} />
          </AdSectionContent>
          <AdSectionDescription>
            <AdDescription ad={ad} />
          </AdSectionDescription>
        </AdSection>
      );
    },
    fallback: (
      <AdSection>
        <AdSectionContent>
          <AdImagesFallback />
          <AdInfoFallback />
        </AdSectionContent>
        <AdSectionDescription>
          <AdDescriptionFallback />
        </AdSectionDescription>
      </AdSection>
    ),
  });
}
