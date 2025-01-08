import { Response, Request, NextFunction } from "express";
import dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
dotenv.config();

export interface CustomRequest extends Request{
    userId?:number,
    email?:string
}

interface CustomJwtPayload extends jwt.JwtPayload {
    isUserExist: {
      id: number;
      email: string;
      password: string;
    };
  }
const authorization = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
    // Get the token from the request header, cookies, or body
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : req.cookies?.token || req.body.token;

        if (!token) {
            res.status(401).json({
                success: false,
                error: "Token is missing",
            });
            return;
        }

        const secret = process.env.JWT_SECRET_KEY as string;

        if (!secret) {
            res.status(500).json({
                success: false,
                error: "Server configuration error",
            });
            return;
        }

        const decoded= jwt.verify(token, secret) as CustomJwtPayload;
        if(decoded){
            req.userId = decoded.isUserExist.id;
            req.email = decoded.isUserExist.email;
        }
        next();
    } catch (error) {

        res.status(500).json({
            success: false,
            error: `Internal Server Error: ${error}`,
        });
    }
};

export { authorization };
