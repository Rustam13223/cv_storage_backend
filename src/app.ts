import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

export default app;
