import { Request, Response } from 'express';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type ms from 'ms';

export const signup = async function (
    req: Request,
    res: Response
): Promise<void> {
    const { email, password } = req.body;

    const candidate = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (candidate) {
        res.status(409).json({ message: 'User already exists' });
        return;
    }

    if (password.length < 6) {
        res.status(400).json({
            message: 'Password must be at least 6 characters long',
        });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await db
        .insert(users)
        .values({
            email,
            password: hashedPassword,
        })
        .returning();

    if (createdUser.length === 0) {
        res.status(500).json({ message: 'User creation failed' });
        return;
    }

    const token = jwt.sign(
        { email: createdUser[0].email },
        process.env.JWT_SECRET as string,
        {
            expiresIn: process.env.JWT_EXPIRATION as ms.StringValue,
        }
    );

    res.status(200).json({ token });
};
