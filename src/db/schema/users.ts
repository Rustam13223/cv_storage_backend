import { pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar().notNull().unique(),
    password: varchar().notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
