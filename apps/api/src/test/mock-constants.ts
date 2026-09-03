import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

export const SERVER_GLOBAL = {
  MEDIA_ROOT_FOLDER: resolve(tmpdir(), 'purrfect-match-test', 'media/images'),
};

export const ENTITY_AD = {
  MAX_IMAGES_PER_AD: 2,
};
