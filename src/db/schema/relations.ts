import { relations } from 'drizzle-orm';
import { projects } from './projects';
import { projectTags } from './projectTags';
import { tags } from './tags';

export const projectsRelations = relations(projects, ({ many }) => ({
    projectTags: many(projectTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
    projectTags: many(projectTags),
}));

export const projectTagsRelations = relations(projectTags, ({ one }) => ({
    project: one(projects, {
        fields: [projectTags.projectId],
        references: [projects.id],
    }),
    tag: one(tags, {
        fields: [projectTags.tagId],
        references: [tags.id],
    }),
}));
