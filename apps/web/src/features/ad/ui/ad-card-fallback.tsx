import { AD_IMAGE_HEIGHT, AD_IMAGE_WIDTH } from '@purrfect_match/shared/entities/ad/constants';
import Image from 'next/image';

import notFoundImg from '@/shared/assets/not-found.png';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { SkeletonText, SkeletonWrapper } from '@/shared/ui/skeleton';

export function AdCardFallback() {
  return (
    <Card>
      <SkeletonWrapper
        render={
          <Image
            alt=""
            className="w-full object-cover"
            src={notFoundImg.src}
            width={AD_IMAGE_WIDTH / 8}
            height={AD_IMAGE_HEIGHT / 8}
          />
        }
      />
      <CardHeader className="gap-0">
        <CardTitle className="text-lg">
          <SkeletonText className="w-48" />
        </CardTitle>
        <span className="text-xs opacity-60">
          <SkeletonText className="w-32" />
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-2">
          <SkeletonWrapper render={<Badge className="lowercase w-16" />} />
          <SkeletonWrapper render={<Badge className="lowercase w-16" />} />
        </div>
        <SkeletonText className="text-lg">$19999</SkeletonText>
      </CardContent>
      <CardFooter>
        <SkeletonWrapper render={<Button className="w-full" />} />
      </CardFooter>
    </Card>
  );
}
