import { AdDescriptionFallback, AdImagesFallback, AdInfoFallback } from '@/features/ad';
import { AdSection } from '@/widgets/ad-section';

export default function Loading() {
  return (
    <AdSection
      descriptionSlot={<AdDescriptionFallback />}
      imagesSlot={<AdImagesFallback />}
      infoSlot={<AdInfoFallback />}
    />
  );
}
