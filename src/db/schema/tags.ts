import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

export const tags = pgTable('tags', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull().unique(),
});
