import type { AnimalType } from '@purrfect_match/shared/entities/animal/types';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/shared/ui/badge';
import { Item, ItemContent, ItemFooter, ItemMedia, ItemTitle } from '@/shared/ui/item';

export function AnimalItem({ animal }: { animal: AnimalType }) {
  return (
    <Item variant="muted" role="listitem">
      <ItemMedia>
        <Image alt={animal.name} src={animal.imageUrl} width={128} height={128} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="capitalize text-2xl text-primary">
          <Link href={`/ad?type=${animal.name}`}>{animal.name}</Link>
        </ItemTitle>
        {animal.description.slice(0, 400)}...
      </ItemContent>
      <ItemFooter>
        <div className="flex gap-1 flex-wrap">
          {animal.breeds
            .toSorted(() => Math.random() - 0.5)
            .slice(0, 6)
            .map((breed) => (
              <Badge key={breed.name}>
                <Link href={`/ad?breed=${breed.name}`}>{breed.name}</Link>
              </Badge>
            ))}
        </div>
      </ItemFooter>
    </Item>
  );
}
