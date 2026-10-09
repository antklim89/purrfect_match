import type { animalBreedTable, animalTypeTable } from './tables';

export type AnimalTypeInsertType = typeof animalTypeTable.$inferInsert;
export type AnimalBreedInsertType = typeof animalBreedTable.$inferInsert;
export type AnimalTypeSelectType = typeof animalTypeTable.$inferSelect;
export type AnimalBreedSelectType = typeof animalBreedTable.$inferSelect;
