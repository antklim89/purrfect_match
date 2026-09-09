import type { AdType } from '@purrfect_match/shared/entities/ad/types';

import { formatDate, formatPrice } from '@/shared/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { ItemGroup } from '@/shared/ui/item';
import { AdContact } from './ad-contact';

export function AdInfo({ ad }: { ad: AdType }) {
  return (
    <Card>
      <CardHeader>
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
      </CardHeader>
      <CardContent className="h-full">
        <ItemGroup>
          {ad.profile.contacts?.map((contact) => (
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
