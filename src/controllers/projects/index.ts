import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import { projects } from '@/db/schema/projects';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { JwtPayload } from '@/middleware/auth';

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
