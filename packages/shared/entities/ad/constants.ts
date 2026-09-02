export const ADS_SORT_BY = ['createdAt', 'name', 'type', 'breed', 'price', 'status'] as const;
export const MAX_ADS_LIMIT = 50;
export const IMAGE_EXT = 'webp';

export const AD_IMAGE_HEIGHT = 1024;
export const AD_IMAGE_WIDTH = 1280;

export const AdStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  UNPUBLISHED: 'UNPUBLISHED',
} as const;
export type AdStatus = (typeof AdStatus)[keyof typeof AdStatus];
