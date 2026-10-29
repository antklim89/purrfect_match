import { AdCard, AdList } from '@/features/ad';
import { AdSort } from '@/features/ad-sort';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { adFavoritesListQuery } from '@/shared/api/queries/ad-queries';
import { ErrorComponent } from '@/shared/ui/error-component';
import { Pagination } from '@/shared/ui/pagination';
import { AdCatalog, AdCatalogFavoritesEmpty } from '@/widgets/ad-catalog';

export default async function Page({ searchParams }: PageProps<'/profile/favorites'>) {
  const query = await searchParams;
  const { data: ads, error } = await adFavoritesListQuery({ query });
  if (error) return <ErrorComponent {...error} />;

  return (
    <AdCatalog
      sortSlot={<AdSort />}
      paginationSlot={<Pagination totalPages={ads.pagination.totalPages} page={ads.pagination.currentPage} />}
    >
      {ads.items.length === 0 && <AdCatalogFavoritesEmpty />}
      <AdList>
        {ads.items.map((ad) => (
          <AdCard key={ad.id} ad={ad} actionSlot={<ToggleFavoriteButton adId={ad.id} inFavorites={ad.inFavorites} />} />
        ))}
      </AdList>
    </AdCatalog>
  );
}
