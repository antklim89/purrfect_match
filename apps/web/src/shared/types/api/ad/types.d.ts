import type { z } from 'zod/v4-mini';
import type { AdCreateSchema, AdFilterSchema } from './schemas';
import type { adTable } from './tables';
export type AdCreateType = z.infer<typeof AdCreateSchema>;
export type AdFilterType = z.infer<typeof AdFilterSchema>;
export type AdInsertType = typeof adTable.$inferInsert;
export type AdSelectType = typeof adTable.$inferSelect;
