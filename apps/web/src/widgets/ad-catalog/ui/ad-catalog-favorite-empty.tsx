import { BookmarkOffIcon } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/shared/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';

export function AdCatalogFavoritesEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookmarkOffIcon />
        </EmptyMedia>
        <EmptyTitle>No Favorites</EmptyTitle>
        <EmptyDescription>You haven't added any favorite ad. </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link className={buttonVariants({ variant: 'outline' })} href="/ad">
          Catalog
        </Link>
      </EmptyContent>
    </Empty>
  );
}
