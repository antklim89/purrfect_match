import { AdDescription, AdImages, AdInfo } from '@/features/ad';
import { apiClient, apiParse } from '@/shared/lib/api-client';
import { ErrorComponent } from '@/shared/ui/error-component';
import { AdSection } from '@/widgets/ad-section';

export default async function Page({ params }: PageProps<'/ad/[adId]'>) {
  'use cache';

  const { adId } = await params;
  const { result: ad, error } = await apiParse(apiClient.api.ad[':id'].$get({ param: { id: adId } }));
  if (error) return <ErrorComponent {...error} />;

  return (
    <AdSection
      descriptionSlot={<AdDescription ad={ad} />}
      imagesSlot={<AdImages ad={ad} />}
      infoSlot={<AdInfo ad={ad} />}
    />
  );
}
