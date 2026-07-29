import { formatDate, formatPrice } from '@/shared/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import type { AdType } from '../model/types';

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
          by {ad.user.name} at {formatDate(ad.createdAt)}
        </p>
      </CardHeader>
      <CardContent className="h-full"></CardContent>
      <CardFooter>
        <p className="w-full text-end text-4xl">{formatPrice(ad.price)}</p>
      </CardFooter>
    </Card>
  );
}
