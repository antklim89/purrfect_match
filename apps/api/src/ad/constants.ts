import type { AdSelectType } from './types';

export const ADS_SORT_BY = ['createdAt', 'name', 'type', 'breed', 'price'] as const satisfies (keyof AdSelectType)[];
export const MAX_ADS_LIMIT = 50;
export const IMAGE_EXT = 'webp';
