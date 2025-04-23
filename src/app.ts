import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import authRouter from '@/routes/auth';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.use('/', authRouter);

export default app;
