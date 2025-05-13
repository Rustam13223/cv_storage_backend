import { Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth';
import { projects } from '@/db/schema/projects';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

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
