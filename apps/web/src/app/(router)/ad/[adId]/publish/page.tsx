import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AdDescription, AdImages, AdInfo } from '@/features/ad';
import { AdPublishButton } from '@/features/ad-publish';
import { adFindOneQuery } from '@/shared/api/queries/ad-queries';
import { getSession } from '@/shared/api/queries/auth-queries';
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

  const { error, data: ad } = await adFindOneQuery({ id: adId });

  if (error?.status === 404) notFound();
  if (error) return <ErrorComponent {...error} />;
  if (!user || user.id !== ad.userId) notFound();

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
        <AdInfo ad={ad} />
      </AdSectionContent>
      <AdSectionDescription>
        <AdDescription ad={ad} />
      </AdSectionDescription>
    </AdSection>
  );
}
