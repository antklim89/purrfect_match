import { PartyPopperIcon } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/shared/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';

export function MyAdsListEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PartyPopperIcon />
        </EmptyMedia>
        <EmptyTitle>No Ads</EmptyTitle>
        <EmptyDescription>You haven&apos;t added any ads yet.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link className={buttonVariants({ variant: 'outline' })} href="/profile/create">
          Create Ad
        </Link>
      </EmptyContent>
    </Empty>
  );
}
