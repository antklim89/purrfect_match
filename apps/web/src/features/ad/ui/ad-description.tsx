import type { AdType } from '../model/types';

export function AdDescription({ ad }: { ad: AdType }) {
  return <p className="whitespace-pre-line">{ad.description}</p>;
}
