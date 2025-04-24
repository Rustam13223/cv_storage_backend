import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import authRouter from '@/routes/auth';
import { authenticate } from './middleware/auth';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.use('/', authRouter);

app.get('/protected', authenticate, (req, res) => {
    res.status(200).json({ message: 'This is a protected route' });
});

export default app;
