import type { GenderType } from '@purrfect_match/shared/models/gender';
import { MarsIcon, VenusIcon } from 'lucide-react';

export function Gender({ gender }: { gender: GenderType }) {
  if (gender === 'male') return <MarsIcon className="stroke-blue-600" />;
  return <VenusIcon className="stroke-pink-600" />;
}
