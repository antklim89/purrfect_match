import type { adImageTable, adTable } from './tables';

export type AdInsertType = typeof adTable.$inferInsert;
export type AdImageInsertType = typeof adImageTable.$inferInsert;
export type AdSelectType = typeof adTable.$inferSelect;
export type AdImageSelectType = typeof adImageTable.$inferSelect;
