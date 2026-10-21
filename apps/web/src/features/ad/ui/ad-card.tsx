import type { ReactNode } from 'react';
import { AD_IMAGE_HEIGHT, AD_IMAGE_WIDTH } from '@purrfect_match/shared/entities/ad/constants';
import type { AdPreviewType } from '@purrfect_match/shared/entities/ad/types';
import Image from 'next/image';
import Link from 'next/link';

import notFoundFallback from '@/shared/assets/not-found.png';
import { calculateAge, formatDate, formatPrice } from '@/shared/lib/utils';
import { badgeVariants } from '@/shared/ui/badge';
import { buttonVariants } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Gender } from '@/shared/ui/gender';

export function AdCard({ ad, actionSlot }: { ad: AdPreviewType; actionSlot?: ReactNode }) {
  const image = ad.images[0];
  const age = calculateAge(ad.birth);

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
      <div className="flex">
        <CardHeader className="flex flex-col gap-1 grow">
          <div className="flex">
            <CardTitle className="text-xl">{ad.name}</CardTitle>
            <Gender gender={ad.gender} />
          </div>
          {age && <span className="text-sm opacity-80">{age.text}</span>}
          <span className="text-sm opacity-80">Published at: {formatDate(ad.publishedAt)}</span>
        </CardHeader>

        <div className="flex flex-col gap-2">{actionSlot}</div>
      </div>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Link className={badgeVariants({ className: 'uppercase' })} href={`/ad?type=${ad.type}`}>
            {ad.type}
          </Link>
          <Link className={badgeVariants({ className: 'uppercase' })} href={`/ad?breed=${ad.breed}`}>
            {ad.breed}
          </Link>
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
