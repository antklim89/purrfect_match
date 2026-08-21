import { AdDescriptionFallback, AdImagesFallback, AdInfoFallback } from '@/features/ad';
import { AdSection } from '@/widgets/ad-section';
import { AdSectionContent, AdSectionDescription } from '@/widgets/ad-section/ui/ad-section';

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
