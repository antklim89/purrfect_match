import type { Route } from 'next';
import { ArrowLeftIcon } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AdDescription, AdImages, AdInfo } from '@/features/ad';
import { AdPublishButton } from '@/features/ad-publish';
import { getMyAd } from '@/shared/api/ads';
import { getSession } from '@/shared/api/auth';
import { buttonVariants } from '@/shared/ui/button';
import { ErrorComponent } from '@/shared/ui/error-component';
import {
  AdSection,
  AdSectionContent,
  AdSectionDescription,
  AdSectionPublishAlert,
  AdSectionPublishAlertActions,
} from '@/widgets/ad-section';

export default async function Page({ params }: PageProps<'/ad/[adId]'>) {
  const { user } = await getSession();
  const { adId } = await params;
  const { error, data: ad } = await getMyAd({ id: adId });

  if (error?.status === 404) notFound();
  if (!user) notFound();
  if (error) return <ErrorComponent {...error} />;
  if (user.id !== ad.userId) notFound();

  return (
    <AdSection>
      <AdSectionPublishAlert
        isPublished={ad.isPublished}
        description={`This is your ad. You can ${ad.isPublished ? 'unpublish' : 'publish'} it.`}
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
          <AdPublishButton
            onPublish={async () => {
              'use server';
              revalidatePath(`/ad/${ad.id}/publish` satisfies Route<`/ad/${string}/publish`>, 'page');
            }}
            id={ad.id}
            isPublished={ad.isPublished}
          />
        </AdSectionPublishAlertActions>
      </AdSectionPublishAlert>

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
