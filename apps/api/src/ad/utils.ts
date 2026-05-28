import { createWriteStream } from 'node:fs';
import * as fs from 'node:fs/promises';
import { join } from 'node:path/posix';
import { Readable } from 'node:stream';
import { buffer } from 'node:stream/consumers';
import { pipeline } from 'node:stream/promises';
import sharp from 'sharp';

import { IMAGE_EXT } from './constants';

export async function uploadImages({
  images,
  folderPath,
  folderUrl,
}: {
  images: File[];
  folderPath: string;
  folderUrl: string;
}) {
  try {
    const savedImages = await Promise.all(images.map(image => uploadImage({ folderPath, folderUrl, image })));
    return savedImages;
  } catch (error) {
    await fs.rm(folderPath);
    throw new Error('Failed to upload images.', { cause: error });
  }
}

async function uploadImage({ image, folderPath, folderUrl }: { folderPath: string; folderUrl: string; image: File }) {
  const fileName = `${crypto.randomUUID()}.${IMAGE_EXT}`;
  const filePath = join(folderPath, fileName);
  const fileUrl = join(folderUrl, fileName);

  await fs.mkdir(folderPath, { recursive: true });

  const [_, blurDataUrl] = await Promise.all([
    transformImageToFile({ filePath, image }),
    transformImageToBlurDataUrl({ image }),
  ]);

  return { fileName, filePath, fileUrl, blurDataUrl };
}

async function transformImageToFile({ image, filePath }: { image: File; filePath: string }) {
  const readStream = Readable.from(image.stream());
  const resizeStream = sharp().resize({ width: 1280, height: 1024 })[IMAGE_EXT]({ quality: 90 });
  const writeStream = createWriteStream(filePath);
  await pipeline(readStream, resizeStream, writeStream);
}

async function transformImageToBlurDataUrl({ image }: { image: File }) {
  const readStream = Readable.from(image.stream());
  const resizeStream = sharp().resize({ width: 80, height: 64 })[IMAGE_EXT]({ quality: 10 });
  const resultBuffer = await buffer(readStream.pipe(resizeStream));
  return `data:image/${IMAGE_EXT};base64,${resultBuffer.toString('base64')}`;
}
