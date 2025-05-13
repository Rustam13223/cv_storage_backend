import { Router } from 'express';
import { getAll } from '@/controllers/projects';

const projectsRouter = Router();

projectsRouter.get('/projects', getAll);

export default projectsRouter;
