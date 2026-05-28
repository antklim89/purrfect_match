import { createWriteStream } from 'node:fs';
import * as fs from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { buffer } from 'node:stream/consumers';
import { pipeline } from 'node:stream/promises';
import { AD_IMAGE_HEIGHT, AD_IMAGE_WIDTH, IMAGE_EXT } from '@purrfect_match/shared/entities/ads/config';
import sharp from 'sharp';

import { MEDIA_ROOT_FOLDER } from '@/lib/constants';

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

export async function uploadImages({ images, userId, adId }: { images: File[]; userId: string; adId: string }) {
  try {
    return await Promise.all(images.map(image => uploadImage({ userId, adId, image })));
  } catch (error) {
    await fs.rm(getAdMediaDir({ userId, adId }), { force: true, recursive: true });
    throw new Error('Failed to upload images.', { cause: error });
  }
}

async function uploadImage({ image, adId, userId }: { userId: string; adId: string; image: File }) {
  const fileName = Bun.randomUUIDv7();
  const adMediaDir = getAdMediaDir({ root: MEDIA_ROOT_FOLDER, userId, adId });
  const adMediaPath = getAdMediaPath({ root: MEDIA_ROOT_FOLDER, userId, adId, fileName });
  const adMediaUrlPath = getAdMediaPath({ userId, adId, fileName });

  await fs.mkdir(adMediaDir, { recursive: true });

  const [blurDataUrl] = await Promise.all([
    transformImageToBlurDataUrl({ image }),
    transformImageToFile({ filePath: adMediaPath, image }),
  ]);

  return { id: fileName, adId, url: adMediaUrlPath, blurDataUrl };
}

async function transformImageToFile({ image, filePath }: { image: File; filePath: string }) {
  const readStream = Readable.from(image.stream());
  const resizeStream = sharp().resize({ width: AD_IMAGE_WIDTH, height: AD_IMAGE_HEIGHT })[IMAGE_EXT]({ quality: 90 });
  const writeStream = createWriteStream(filePath);
  await pipeline(readStream, resizeStream, writeStream);
}

async function transformImageToBlurDataUrl({ image }: { image: File }) {
  const readStream = Readable.from(image.stream());
  const resizeStream = sharp()
    .resize({ width: AD_IMAGE_WIDTH / 16, height: AD_IMAGE_HEIGHT / 16 })
    [IMAGE_EXT]({ quality: 10 });
  const resultBuffer = await buffer(readStream.pipe(resizeStream));
  return `data:image/${IMAGE_EXT};base64,${resultBuffer.toString('base64')}`;
}
