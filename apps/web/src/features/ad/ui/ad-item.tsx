'use client';
import type { ReactNode } from 'react';
import { AD_IMAGE_HEIGHT, AD_IMAGE_WIDTH } from '@purrfect_match/shared/entities/ad/constants';
import type { AdPreviewType } from '@purrfect_match/shared/entities/ad/types';
import Image from 'next/image';
import Link from 'next/link';

import notFoundFallback from '@/shared/assets/not-found.png';
import { calculateAge, formatDate, formatPrice } from '@/shared/lib/utils';
import { Gender } from '@/shared/ui/gender';
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemMedia, ItemTitle } from '@/shared/ui/item';

export function AdItem({ ad, actionsSlot }: { ad: AdPreviewType; actionsSlot: ReactNode }) {
  const image = ad.images[0];

  return (
    <Item className="flex relative hover:bg-muted cursor-pointer" variant="muted">
      <ItemMedia variant="image">
        <Image
          className="aspect-video w-full object-cover"
          src={image?.url ? image.url : notFoundFallback.src}
          blurDataURL={image?.blurDataUrl ?? notFoundFallback.blurDataURL}
          placeholder="blur"
          alt="Image with animal"
          width={AD_IMAGE_WIDTH / 16}
          height={AD_IMAGE_HEIGHT / 16}
        />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="text-lg flex-col">
          <h3 className="flex gap-2 items-center">
            {ad.name} {ad.type} {ad.breed}
            <Gender gender={ad.gender} />
          </h3>
        </ItemTitle>

        <ItemDescription>{calculateAge(ad.birth).text}</ItemDescription>
        <ItemDescription>Published at: {formatDate(ad.publishedAt)}</ItemDescription>
      </ItemContent>

      <ItemActions className="z-1">{actionsSlot}</ItemActions>

      <ItemFooter className="justify-end">
        <span>{formatPrice(ad.price)}</span>
      </ItemFooter>

      <Link
        aria-label={`ad item ${ad.name} ${ad.type} ${ad.breed}`}
        href={`/ad/${ad.id}/publish`}
        className="absolute top-0 left-0 bottom-0 right-0"
      />
    </Item>
  );
}
