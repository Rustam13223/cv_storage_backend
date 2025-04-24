import { Router } from 'express';
import signupRouter from './signup';
import signinRouter from './signin';

const authRouter = Router();

authRouter.use('/auth', signupRouter);
authRouter.use('/auth', signinRouter);

export default authRouter;
