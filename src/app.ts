import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import { db } from './db';
import { users } from './db/schema/users';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.get('/create', async (req, res) => {
    await db.insert(users).values({
        email: 'johndoe@mail.com',
        password: 'password',
    });

    res.status(201).json({ message: 'User created' });
});

export default app;
