import dotenv from 'dotenv';
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
dotenv.config();
declare global {
    namespace Express {
        interface Request {
            user?: any;  
        }
    }
}

const authMiddleware =(req: Request, res: Response, next: NextFunction):void => {
    const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
    
    if (!token) {
         res.status(401).json({ message: 'No token provided' });
         return
    }

    try {

        const jwtSecret = process.env.jwt_token;
        if (!jwtSecret) {
            throw new Error('JWT secret key is not defined in environment variables.');
        }

        const decoded = jwt.verify(token, jwtSecret as string);

        req.user = decoded;  
        next();

    } catch (error) {
        console.log('Invalid token');
        res.status(400).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
