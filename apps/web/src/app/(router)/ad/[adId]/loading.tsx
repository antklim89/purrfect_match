import { AdDescriptionFallback, AdImagesFallback, AdInfoFallback } from '@/features/ad';
import { AdSection, AdSectionContent, AdSectionDescription } from '@/widgets/ad-section';

export default function Loading() {
  return (
    <AdSection>
      <AdSectionContent>
        <AdImagesFallback />
        <AdInfoFallback />
      </AdSectionContent>
      <AdSectionDescription>
        <AdDescriptionFallback />
      </AdSectionDescription>
    </AdSection>
  );
}
