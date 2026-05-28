export const adConfig = {
  isPublished: {
    required: false,
  },
  name: {
    min: 2,
    max: 400,
    required: true,
  },
  description: {
    min: 20,
    max: 40000,
    required: true,
  },
  breed: {
    min: 2,
    max: 400,
    required: true,
  },
  type: {
    min: 2,
    max: 400,
    required: true,
  },
  price: {
    min: 2,
    max: 900000,
    required: true,
  },
  search: {
    max: 200,
  },
} as const;

export const ADS_SORT_BY = ['createdAt', 'name', 'type', 'breed', 'price'] as const;
export const MAX_ADS_LIMIT = 50;
export const IMAGE_EXT = 'webp';

export const AD_IMAGE_HEIGHT = 1024;
export const AD_IMAGE_WIDTH = 1280;
