import { CatIcon } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/shared/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';

export function AdCatalogEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CatIcon />
        </EmptyMedia>
        <EmptyTitle>No Ads</EmptyTitle>
        <EmptyDescription>No ads was found. Try to change filter settings</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link className={buttonVariants({ variant: 'outline' })} href="/ad">
          Clear Filters
        </Link>
      </EmptyContent>
    </Empty>
  );
}
