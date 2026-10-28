import type { AnimalPreviewType } from '@purrfect_match/shared/entities/animal/types';
import { BookIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/shared/ui/badge';
import { Item, ItemContent, ItemFooter, ItemHeader, ItemMedia, ItemTitle } from '@/shared/ui/item';

export function AnimalItem({ animal }: { animal: AnimalPreviewType }) {
  return (
    <Item variant="muted" role="listitem">
      <ItemMedia>
        <Image alt={animal.name} src={animal.imageUrl} width={128} height={128} />
      </ItemMedia>

      <ItemContent>
        <ItemHeader>
          <ItemTitle className="capitalize text-2xl">{animal.name}</ItemTitle>
          <div className="flex gap-2 items-center">
            <Link href={`/animal/${animal.name}`}>
              <BookIcon className="stroke-primary" />
            </Link>
            <Link href={`/ad?type=${animal.name}`}>
              <SearchIcon className="stroke-primary" />
            </Link>
          </div>
        </ItemHeader>
        {animal.description.slice(0, 400)}...
      </ItemContent>

      <ItemFooter>
        <div className="flex gap-1 flex-wrap">
          {animal.breeds.slice(0, 6).map((breed) => (
            <Badge key={breed.name}>
              <Link href={`/ad?breed=${breed.name}`}>{breed.name}</Link>
            </Badge>
          ))}
        </div>
      </ItemFooter>
    </Item>
  );
}
