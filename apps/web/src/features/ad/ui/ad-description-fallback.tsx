import { SkeletonText } from '@/shared/ui/skeleton';

export function AdDescriptionFallback() {
  return (
    <p className="whitespace-pre-line flex flex-col gap-3">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <SkeletonText className="w-full" key={i} />
      ))}
      <SkeletonText className="w-3/4" />
    </p>
  );
}
