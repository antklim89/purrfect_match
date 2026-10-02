import type { ReactNode } from 'react';
import type { AdType } from '@purrfect_match/shared/entities/ad/types';
import Link from 'next/link';

import { cn, formatDate, formatPrice } from '@/shared/lib/utils';
import { buttonVariants } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { ItemGroup } from '@/shared/ui/item';
import { AdContact } from './ad-contact';

export function AdInfo({ ad, actionsSlot }: { ad: AdType; actionsSlot?: ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex justify-between w-full">
        <div>
          <h1 className="flex gap-4 items-end capitalize">
            <span className="text-4xl">{ad.name}</span>
            <Link className={cn(buttonVariants({ variant: 'link' }), 'text-xl px-0')} href={`/ad?type=${ad.type}`}>
              {ad.type}
            </Link>
            <Link className={cn(buttonVariants({ variant: 'link' }), 'text-xl px-0')} href={`/ad?breed=${ad.breed}`}>
              {ad.breed}
            </Link>
          </h1>
          <p className="text-sm text-muted-foreground">
            by {ad.user.name} at {formatDate(ad.publishedAt)}
          </p>
        </div>

        <div className="flex flex-col gap-4">{actionsSlot}</div>
      </CardHeader>
      <CardContent className="h-full">
        <ItemGroup>
          {ad.user.contacts?.map((contact) => (
            <AdContact contact={contact} key={contact.type + contact.number} />
          ))}
        </ItemGroup>
      </CardContent>
      <CardFooter>
        <p className="w-full text-end text-4xl">{formatPrice(ad.price)}</p>
      </CardFooter>
    </Card>
  );
}
