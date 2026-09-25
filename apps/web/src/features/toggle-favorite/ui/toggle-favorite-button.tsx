'use client';

import { useTransition } from 'react';
import type { AdType } from '@purrfect_match/shared/entities/ad/types';
import { BookmarkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { toggleFavorite } from '@/shared/api/queries/favorite-query';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';

export function ToggleFavoriteButton({ adId, inFavorites }: { adId: AdType['id']; inFavorites: boolean }) {
  const { refresh } = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggleFavorite() {
    startTransition(async () => {
      const { error } = await toggleFavorite({ adId, inFavorites });
      if (error) toast.error(error.message, { id: adId });
      refresh();
    });
  }

  return (
    <Button variant="secondary" className="p-0" size="icon-lg" onClick={handleToggleFavorite}>
      {isPending ? (
        <Spinner />
      ) : inFavorites ? (
        <BookmarkIcon className="stroke-primary fill-primary" />
      ) : (
        <BookmarkIcon />
      )}
    </Button>
  );
}
