import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Skeleton, SkeletonText } from '@/shared/ui/skeleton';
import { AdSection } from './ad-section';

export function AdSectionFallback() {
  return (
    <AdSection
      descriptionSlot={
        <p className="whitespace-pre-line">
          <SkeletonText className="w-full" />
          <SkeletonText className="w-full" />
          <SkeletonText className="w-full" />
          <SkeletonText className="w-full" />
          <SkeletonText className="w-3/4" />
        </p>
      }
      imagesSlot={<Skeleton className="w-full h-152" />}
      infoSlot={
        <Card>
          <CardHeader>
            <SkeletonText className="text-2xl w-84" />
            <SkeletonText className="w-64" />
            <SkeletonText className="text-sm w-64" />
          </CardHeader>
          <CardContent className="h-full">
            <SkeletonText className="w-1/2" />
            <SkeletonText className="w-1/2" />
            <SkeletonText className="w-1/2" />
            <SkeletonText className="w-1/2" />
            <SkeletonText className="w-1/2" />
          </CardContent>
          <CardFooter>
            <p className="w-full text-end text-4xl">
              <SkeletonText className="w-64" />
            </p>
          </CardFooter>
        </Card>
      }
    />
  );
}
