import { Router } from 'express';
import signupRouter from './signup';

const authRouter = Router();

authRouter.use('/auth', signupRouter);

export default authRouter;
