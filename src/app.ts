import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import authRouter from '@/routes/auth';
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import projectsRouter from './routes/projects';
import cors from 'cors';

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
    })
);

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.use('/', authRouter);
app.use('/', authenticate, projectsRouter);

app.get('/protected', authenticate, (req, res) => {
    res.status(200).json({ message: 'This is a protected route' });
});

app.use(errorHandler);

export default app;
