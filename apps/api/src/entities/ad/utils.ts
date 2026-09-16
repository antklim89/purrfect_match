import { createWriteStream } from 'node:fs';
import * as fs from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { buffer } from 'node:stream/consumers';
import { pipeline } from 'node:stream/promises';
import { AD_IMAGE_HEIGHT, AD_IMAGE_WIDTH, IMAGE_EXT } from '@purrfect_match/shared/entities/ad/constants';
import sharp from 'sharp';

import { MEDIA_ROOT_FOLDER, MEDIA_ROOT_URL } from '@/models/constants';

export function getUserMediaDir({ root = '/', userId }: { root?: string; userId: string }) {
  return resolve(root, userId);
}

export function getAdMediaDir({ root, userId, adId }: { root?: string; userId: string; adId: string }) {
  return join(getUserMediaDir({ root, userId }), 'ads', adId);
}

export function getAdMediaPath({
  root,
  userId,
  adId,
  fileName,
}: {
  root?: string;
  userId: string;
  adId: string;
  fileName: string;
}) {
  return join(getAdMediaDir({ root, adId, userId }), fileName);
}

export async function uploadImage({ image, adId, userId }: { userId: string; adId: string; image: File }) {
  const fileName = Bun.randomUUIDv7();

  try {
    const adMediaDir = getAdMediaDir({ root: MEDIA_ROOT_FOLDER, userId, adId });
    const adMediaPath = getAdMediaPath({ root: MEDIA_ROOT_FOLDER, userId, adId, fileName });
    const adMediaUrlPath = getAdMediaPath({ root: MEDIA_ROOT_URL, userId, adId, fileName });

    await fs.mkdir(adMediaDir, { recursive: true });

    const [blurDataUrl] = await Promise.all([
      transformImageToBlurDataUrl({ image }),
      transformImageToFile({ filePath: adMediaPath, image }),
    ]);

    return { data: { id: fileName, adId, url: adMediaUrlPath, blurDataUrl }, error: null };
  } catch {
    await fs.rm(getAdMediaPath({ userId, adId, fileName }), { force: true, recursive: true });
    return { data: null, error: { message: 'Failed to upload image.' } };
  }
}

async function transformImageToFile({ image, filePath }: { image: File; filePath: string }) {
  const readStream = Readable.from(image.stream());
  const resizeStream = sharp().resize({ width: AD_IMAGE_WIDTH, height: AD_IMAGE_HEIGHT, fit: 'cover' })[IMAGE_EXT]();
  const writeStream = createWriteStream(filePath);
  await pipeline(readStream, resizeStream, writeStream);
}

async function transformImageToBlurDataUrl({ image }: { image: File }) {
  const readStream = Readable.from(image.stream());
  const resizeStream = sharp()
    .resize({ width: Math.round(AD_IMAGE_WIDTH / 16), height: Math.round(AD_IMAGE_HEIGHT / 16), fit: 'cover' })
    .blur()
    [IMAGE_EXT]({ quality: 5 });
  const resultBuffer = await buffer(readStream.pipe(resizeStream));
  return `data:image/${IMAGE_EXT};base64,${resultBuffer.toString('base64')}`;
}
