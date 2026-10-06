import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AdDescription, AdImages, AdInfo } from '@/features/ad';
import { AdPublishButton } from '@/features/ad-publish';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { adFindOneQuery } from '@/shared/api/queries/ad-queries';
import { getSession } from '@/shared/api/queries/auth-queries';
import { apiCall, apiSessionClient } from '@/shared/lib/api-client';
import { loader } from '@/shared/lib/loader';
import { Button, buttonVariants } from '@/shared/ui/button';
import { ErrorComponent } from '@/shared/ui/error-component';
import { Spinner } from '@/shared/ui/spinner';
import {
  AdSection,
  AdSectionContent,
  AdSectionDescription,
  AdSectionPublishAlert,
  AdSectionPublishAlertActions,
} from '@/widgets/ad-section';

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
    promises: {
      params: props.params,
      session: getSession(),
    },
    props: {
      favoriteButton: favoriteButtonLoader,
    },

    async render({ promises: { params, session }, props: { favoriteButton } }) {
      const { error, data: ad } = await adFindOneQuery({ id: params.adId });
      if (error) return <ErrorComponent {...error} />;
      if (!session?.user || session.user?.id !== ad.userId) notFound();

      return (
        <AdSection>
          <AdSectionPublishAlert
            status={ad.status}
            description={`This is your ad. You can ${ad.status ? 'unpublish' : 'publish'} it.`}
          >
            <AdSectionPublishAlertActions>
              <Link
                title="back to my ads"
                aria-label="back to my ads"
                className={buttonVariants({ variant: 'outline' })}
                href="/profile/my-ads"
              >
                <ArrowLeftIcon />
              </Link>
              <AdPublishButton id={ad.id} status={ad.status} />
            </AdSectionPublishAlertActions>
          </AdSectionPublishAlert>

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
  });
}
