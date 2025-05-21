import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { JwtPayload } from '@/middleware/auth';
import { InferenceClient } from '@huggingface/inference';
import { TokenClassificationOutput } from '@huggingface/tasks';
import { tags } from '@/db/schema/tags';
import { projects } from '@/db/schema/projects';
import { projectTags } from '@/db/schema/projectTags';

export const deleteById = async function (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    const projectId = Number(req.params.id);

    const deletedProject = await db
        .delete(projects)
        .where(eq(projects.id, projectId))
        .returning();

    res.status(200).json(deletedProject);
};

export const getAll = async function (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    const userId = req.user?.userId as number;

    const userProjects = await db.query.projects.findMany({
        where: eq(projects.userId, userId),
        with: {
            projectTags: {
                columns: {
                    tagId: false,
                    projectId: false,
                },
                with: {
                    tag: true,
                },
            },
        },
    });

    res.status(200).json(userProjects);
};

export const getById = async function (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    const projectId = req.params.id;

    const project = await db.query.projects.findFirst({
        where: () => eq(projects.id, Number(projectId)),
        with: {
            projectTags: {
                columns: {
                    tagId: false,
                    projectId: false,
                },
                with: {
                    tag: true,
                },
            },
        },
    });

    res.status(200).json(project);
};

export const create = async function (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    const user = req.user as JwtPayload;

    const { title, description } = req.body;

    if (!title || !description) {
        res.status(400);
        return;
    }

    const client = new InferenceClient(process.env.HF_TOKEN);

    const response = await client.tokenClassification({
        model: 'dslim/bert-base-NER',
        inputs: description,
    });

    const techs = extractTechnologies(response);

    const project = await db
        .insert(projects)
        .values({
            userId: user.userId,
            title,
            description,
        })
        .returning();

    const insertedTags = await Promise.all(
        techs.map(async (name) => {
            const existing = await db.query.tags.findFirst({
                where: (t, { eq }) => eq(t.name, name),
            });
            if (existing) return existing;

            const [inserted] = await db
                .insert(tags)
                .values({ name })
                .returning();
            return inserted;
        })
    );

    if (insertedTags.length) {
        await db.insert(projectTags).values(
            insertedTags.map((tag) => ({
                projectId: project[0].id,
                tagId: tag.id,
            }))
        );
    }

    res.status(201).json(project);
};

export const update = async function (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    const user = req.user as JwtPayload;

    const { title, description } = req.body;
    const projectId = Number(req.params.id);

    if (!title || !description) {
        res.status(400);
        return;
    }

    const candidate = await db.query.projects.findFirst({
        where: (fields, { eq, and }) =>
            and(eq(fields.id, projectId), eq(fields.userId, user.userId)),
    });

    if (!candidate) {
        res.status(400);
        return;
    }

    const updatedProject = await db
        .update(projects)
        .set({
            title,
            description,
        })
        .where(eq(projects.id, projectId))
        .returning();

    res.status(200).json(updatedProject);
};

function extractTechnologies(nerResults: TokenClassificationOutput): string[] {
    const techTags = new Set();
    const keywords = ['ORG', 'MISC'];

    nerResults.forEach((entity) => {
        if (keywords.includes(entity.entity_group as string)) {
            techTags.add(entity.word);
        }
    });

    return Array.from(techTags) as string[];
}
