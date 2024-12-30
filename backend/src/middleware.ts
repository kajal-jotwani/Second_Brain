import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
const secretKey = process.env.JWT_SECRET as string;
type my_custom_type = {
    userId: string
}

export const userMiddleware = (req:Request, res:Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, secretKey)
    if(decoded && typeof decoded == 'object'){
        req.userId = decoded.id;
        next();
    }else{
        res.status(403).json({
            message: "You are logged in"
        })
    }
}