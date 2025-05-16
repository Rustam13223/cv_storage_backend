import { Router } from 'express';
import {
    create,
    getAll,
    getById,
    deleteById,
    update,
} from '@/controllers/projects';

const projectsRouter = Router();

projectsRouter.get('/projects', getAll);
projectsRouter.get('/projects/:id', getById);
projectsRouter.post('/projects', create);
projectsRouter.delete('/projects/:id', deleteById);
projectsRouter.put('/projects/:id', update);

export default projectsRouter;
