import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import { verifyAccessToken } from '../utils/jwtUtils';
import { AccountStatusEnum } from '../types/enums';


interface TokenPayload {
    id: string;
    status: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["accessToken"];
    if (!token)
        return next(new AppError("Token must be provided", 401));

    try {
        const payload: TokenPayload | null = verifyAccessToken(token);
        if (payload) {
            req.user = payload;

            return next();
        }
        else{
            return next( new AppError("Unauthorized: Invalid TOken", 401));
        }
    }
    catch (err) {
        res.status(401).json({
            message: "Unauthorized: Invalid TOken"
        });
    }
}