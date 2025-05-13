import {
    pgTable,
    integer,
    varchar,
    text,
    timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const projects = pgTable('projects', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer()
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    title: varchar().notNull(),
    description: text().notNull(),
    githubUrl: varchar(),
    createdAt: timestamp('created_at').defaultNow(),
});
