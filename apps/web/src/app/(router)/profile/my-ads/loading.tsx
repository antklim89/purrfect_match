import { AdItemFallback } from '@/features/ad';
import { MyAdsList } from '@/widgets/my-ads-list';

export default function Loading() {
  return (
    <MyAdsList>
      {Array.from({ length: 20 }, (_, index) => (
        <AdItemFallback key={index} />
      ))}
    </MyAdsList>
  );
}
