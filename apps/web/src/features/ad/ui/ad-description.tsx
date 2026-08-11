import type { AdType } from '@purrfect_match/shared/entities/ad/types';

export function AdDescription({ ad }: { ad: AdType }) {
  return <p className="whitespace-pre-line">{ad.description}</p>;
}
