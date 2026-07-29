import { AD_IMAGE_HEIGHT, AD_IMAGE_WIDTH } from '@purrfect_match/shared/entities/ads/config';
import Image from 'next/image';
import Link from 'next/link';

import adCardFallback from '@/shared/assets/ad-card-fallback.jpg';
import { formatDate, formatPrice } from '@/shared/lib/utils';
import { buttonVariants } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import type { AdPreviewType } from '../model/types';

export function AdCard({ ad }: { ad: AdPreviewType }) {
  const image = ad.images[0];

  return (
    <Card>
      <Image
        className="aspect-video w-full object-cover"
        src={image?.url ? `/media${image.url}` : adCardFallback.src}
        blurDataURL={image?.blurDataUrl ?? adCardFallback.blurDataURL}
        placeholder="blur"
        alt="Image with animal"
        width={AD_IMAGE_WIDTH / 8}
        height={AD_IMAGE_HEIGHT / 8}
      />
      <CardHeader className="gap-0">
        <CardTitle className="text-lg">{ad.name}</CardTitle>
        <span className="text-xs opacity-60">{formatDate(ad.createdAt)}</span>
      </CardHeader>
      <CardContent>
        <span className="capitalize">{ad.type}</span> <span className="capitalize">{ad.breed}</span>
      </CardContent>
      <CardFooter className="justify-between">
        <Link href={`/ad/${ad.id}`} className={buttonVariants({ className: 'w-full max-w-28' })}>
          Show
        </Link>
        <span className="text-lg">{formatPrice(ad.price)}</span>
      </CardFooter>
    </Card>
  );
}
