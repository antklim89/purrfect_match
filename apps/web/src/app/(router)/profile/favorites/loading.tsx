import { AdCardFallback, AdList } from '@/features/ad';

export default function Loading() {
  return (
    <AdList>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <AdCardFallback key={i} />
      ))}
    </AdList>
  );
}
