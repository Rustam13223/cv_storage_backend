import { Request, Response, NextFunction } from 'express';

export const errorHandler = async function (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line
    next: NextFunction
): Promise<void> {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
};
