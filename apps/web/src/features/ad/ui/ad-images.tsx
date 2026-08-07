import { AD_IMAGE_HEIGHT, AD_IMAGE_WIDTH } from '@purrfect_match/shared/entities/ads/config';
import type { AdType } from '@purrfect_match/shared/entities/ads/types';
import Image from 'next/image';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/ui/carousel';

export function AdImages({ ad }: { ad: AdType }) {
  return (
    <Carousel orientation="vertical" opts={{ align: 'start', loop: true }}>
      <CarouselContent className="-mt-1 h-152 cursor-pointer select-none">
        {ad.images.map(image => (
          <CarouselItem className="basis-1/2 pt-1" key={image.id}>
            <Image
              className=""
              alt="ad image"
              src={`/media${image.url}`}
              width={AD_IMAGE_WIDTH}
              height={AD_IMAGE_HEIGHT}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
