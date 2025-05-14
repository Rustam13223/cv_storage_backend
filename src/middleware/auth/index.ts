import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

export interface JwtPayload {
    email: string;
    userId: number;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export const authenticate = async function (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;
        req.user = decoded;
        next();
        // eslint-disable-next-line
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
