import { Router } from 'express';
import { create, getAll, getById } from '@/controllers/projects';

const projectsRouter = Router();

projectsRouter.get('/projects', getAll);
projectsRouter.get('/projects/:id', getById);
projectsRouter.post('/projects', create);

export default projectsRouter;
