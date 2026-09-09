import { AD_IMAGE_HEIGHT, AD_IMAGE_WIDTH } from '@purrfect_match/shared/entities/ad/constants';
import type { AdPreviewType } from '@purrfect_match/shared/entities/ad/types';
import Image from 'next/image';
import Link from 'next/link';

import notFoundFallback from '@/shared/assets/not-found.png';
import { formatDate, formatPrice } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { buttonVariants } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';

export function AdCard({ ad }: { ad: AdPreviewType }) {
  const image = ad.images[0];

  return (
    <Card>
      <Image
        className="w-full object-cover"
        src={image?.url ? image.url : notFoundFallback.src}
        blurDataURL={image?.blurDataUrl ?? notFoundFallback.blurDataURL}
        placeholder="blur"
        alt="Image with animal"
        width={AD_IMAGE_WIDTH / 8}
        height={AD_IMAGE_HEIGHT / 8}
      />
      <CardHeader className="gap-0">
        <CardTitle className="text-lg">{ad.name}</CardTitle>
        <span className="text-xs opacity-60">{formatDate(ad.publishedAt)}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Badge className="lowercase">{ad.type}</Badge>
          <Badge className="lowercase">{ad.breed}</Badge>
        </div>
        <span className="text-lg">{formatPrice(ad.price)}</span>
      </CardContent>
      <CardFooter>
        <Link href={`/ad/${ad.id}`} className={buttonVariants({ className: 'w-full' })}>
          Show
        </Link>
      </CardFooter>
    </Card>
  );
}
