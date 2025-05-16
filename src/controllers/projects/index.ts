import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import { projects } from '@/db/schema/projects';
import { db } from '@/db';
import { and, eq } from 'drizzle-orm';
import { JwtPayload } from '@/middleware/auth';

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

    const userProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, userId));

    res.status(200).json(userProjects);
};

export const getById = async function (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    const projectId = req.params.id;

    const project = await db.query.projects.findFirst({
        where: () => eq(projects.id, Number(projectId)),
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

    const project = await db
        .insert(projects)
        .values({
            userId: user.userId,
            title,
            description,
        })
        .returning();

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
