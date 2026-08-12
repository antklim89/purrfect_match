'use client';

import { Item, ItemContent, ItemDescription, ItemFooter, ItemMedia, ItemTitle } from '@/shared/ui/item';
import { Skeleton, SkeletonText } from '@/shared/ui/skeleton';

export function AdItemFallback() {
  return (
    <Item variant="outline">
      <ItemMedia variant="image">
        <Skeleton className="w-full h-full" />
      </ItemMedia>

      <ItemContent>
        <ItemTitle className="text-lg">
          <SkeletonText className="w-52" />
        </ItemTitle>

        <ItemDescription>
          <SkeletonText className="w-34" />
        </ItemDescription>
      </ItemContent>

      <ItemFooter className="justify-end">
        <SkeletonText className="w-32" />
      </ItemFooter>
    </Item>
  );
}
