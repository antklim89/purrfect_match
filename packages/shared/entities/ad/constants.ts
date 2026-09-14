export const ADS_SORT_BY = ['publishedAt', 'price', 'status'] as const;
export const ADS_SORT_BY_DEFAULT = ADS_SORT_BY[0];
export const ADS_ORDER_BY = ['desc', 'asc'] as const;
export const ADS_ORDER_BY_DEFAULT = ADS_ORDER_BY[0];

export const MAX_ADS_LIMIT = 50;
export const IMAGE_EXT = 'webp';

export const AD_IMAGE_HEIGHT = 1024;
export const AD_IMAGE_WIDTH = 1280;
export const MAX_IMAGES_PER_AD = 20;

export const AdStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  UNPUBLISHED: 'UNPUBLISHED',
} as const;
export type AdStatus = (typeof AdStatus)[keyof typeof AdStatus];
