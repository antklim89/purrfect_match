import { AdCard, AdList } from '@/features/ad';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { adFavoritesListQuery } from '@/shared/api/queries/ad-queries';
import { ErrorComponent } from '@/shared/ui/error-component';

export default async function Page() {
  const { data: ads, error } = await adFavoritesListQuery();
  if (error) return <ErrorComponent {...error} />;

  return (
    <AdList>
      {ads.items.map((ad) => (
        <AdCard key={ad.id} ad={ad} actionSlot={<ToggleFavoriteButton adId={ad.id} inFavorites={ad.inFavorites} />} />
      ))}
    </AdList>
  );
}
