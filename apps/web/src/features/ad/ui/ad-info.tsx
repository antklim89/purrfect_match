import type { ReactNode } from 'react';
import type { AdType } from '@purrfect_match/shared/entities/ad/types';

import { formatDate, formatPrice } from '@/shared/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { ItemGroup } from '@/shared/ui/item';
import { AdContact } from './ad-contact';

export function AdInfo({ ad, actionsSlot }: { ad: AdType; actionsSlot?: ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex justify-between w-full">
        <div>
          <h1>
            <span className="text-2xl capitalize">{ad.name}</span>
            <br />
            <span className="capitalize">
              {ad.type} {ad.breed}
            </span>
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
