import type { AdType } from '@purrfect_match/shared/entities/ads/types';

export function AdDescription({ ad }: { ad: AdType }) {
  return <p className="whitespace-pre-line">{ad.description}</p>;
}
