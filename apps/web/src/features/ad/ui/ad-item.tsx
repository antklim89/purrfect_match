'use client';
import type { ReactNode } from 'react';
import { AD_IMAGE_HEIGHT, AD_IMAGE_WIDTH } from '@purrfect_match/shared/entities/ad/config';
import type { AdPreviewType } from '@purrfect_match/shared/entities/ad/types';
import Image from 'next/image';
import Link from 'next/link';

import adCardFallback from '@/shared/assets/ad-card-fallback.jpg';
import { formatDate, formatPrice } from '@/shared/lib/utils';
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemMedia, ItemTitle } from '@/shared/ui/item';

export function AdItem({ ad, actionsSlot }: { ad: AdPreviewType; actionsSlot: ReactNode }) {
  const image = ad.images[0];

  return (
    <Item className="flex relative hover:bg-muted cursor-pointer" variant="outline">
      <ItemMedia variant="image">
        <Image
          className="aspect-video w-full object-cover"
          src={image?.url ? image.url : adCardFallback.src}
          blurDataURL={image?.blurDataUrl ?? adCardFallback.blurDataURL}
          placeholder="blur"
          alt="Image with animal"
          width={AD_IMAGE_WIDTH / 16}
          height={AD_IMAGE_HEIGHT / 16}
        />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="text-lg">
          {ad.name} {ad.type} {ad.breed}
        </ItemTitle>

        <ItemDescription>{formatDate(ad.createdAt)}</ItemDescription>
      </ItemContent>

      <ItemActions className="z-1">{actionsSlot}</ItemActions>

      <ItemFooter className="justify-end">
        <span>{formatPrice(ad.price)}</span>
      </ItemFooter>

      <Link href={`/ad/${ad.id}`} className="absolute top-0 left-0 bottom-0 right-0" />
    </Item>
  );
}
