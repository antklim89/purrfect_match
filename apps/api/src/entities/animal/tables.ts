import { pgTable, text } from 'drizzle-orm/pg-core';

export const animalTypeTable = pgTable('animal_type', {
  name: text().notNull().primaryKey(),
  imageUrl: text().notNull(),
  description: text().notNull(),
});

export const animalBreedTable = pgTable('animal_breed', {
  name: text().notNull().primaryKey(),
  description: text().notNull(),
  animalTypeName: text()
    .notNull()
    .references(() => animalTypeTable.name, { onDelete: 'restrict' }),
});
