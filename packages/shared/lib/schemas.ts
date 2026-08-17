import { z } from 'zod/v4-mini';

export const uuidv7Schema = z.object({
  id: z.string().check(z.uuidv7()),
});

export function formDataWithImagesSchema<Schema extends z.ZodMiniType>(inputSchema: Schema) {
  return z.object({
    input: z.pipe(
      z.transform<string, unknown>(v => {
        try {
          return JSON.parse(v);
        } catch {
          return 'Failed to parse json.';
        }
      }),
      inputSchema,
    ),
    images: ImagesSchema,
  });
}

export const ImagesSchema = z.pipe(
  z.transform<File[]>(v => {
    if (v == null) return v;
    return Array.isArray(v) ? v : [v];
  }),
  z.array(z.file()).check(z.minLength(1), z.maxLength(10)),
);
