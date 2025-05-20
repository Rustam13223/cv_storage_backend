import { pgTable, integer, primaryKey } from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { tags } from './tags';

export const projectTags = pgTable(
    'project_tags',
    {
        projectId: integer('project_id')
            .notNull()
            .references(() => projects.id, { onDelete: 'cascade' }),
        tagId: integer('tag_id')
            .notNull()
            .references(() => tags.id, { onDelete: 'cascade' }),
    },
    (t) => [primaryKey({ columns: [t.projectId, t.tagId] })]
);
