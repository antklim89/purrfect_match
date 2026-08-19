import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import { Item, ItemGroup } from '@/shared/ui/item';
import { SkeletonText } from '@/shared/ui/skeleton';

export function AdInfoFallback() {
  return (
    <Card>
      <CardHeader>
        <SkeletonText className="text-2xl w-84" />
        <SkeletonText className="w-64" />
        <SkeletonText className="text-sm w-64" />
      </CardHeader>
      <CardContent className="h-full">
        <ItemGroup>
          {[1, 2, 3, 4].map(i => (
            <Item key={i} variant="outline">
              <SkeletonText className="w-full" />
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
      <CardFooter>
        <p className="w-full text-end text-4xl">
          <SkeletonText className="w-64" />
        </p>
      </CardFooter>
    </Card>
  );
}
