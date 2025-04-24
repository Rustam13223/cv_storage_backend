import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type ms from 'ms';

export const signin = async function (
    req: Request,
    res: Response
): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }

    const candidate = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!candidate) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
    }

    const match = await bcrypt.compare(password, candidate.password);

    if (!match) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
    }

    const token = jwt.sign(
        { email: candidate.email },
        process.env.JWT_SECRET as string,
        {
            expiresIn: process.env.JWT_EXPIRATION as ms.StringValue,
        }
    );

    res.status(200).json({ token });
};
