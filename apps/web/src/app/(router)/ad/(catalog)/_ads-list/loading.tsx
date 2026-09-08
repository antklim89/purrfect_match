import { AdCardFallback, AdList } from '@/features/ad';

export default function Loading() {
  return (
    <AdList>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <AdCardFallback key={i} />
      ))}
    </AdList>
  );
}
