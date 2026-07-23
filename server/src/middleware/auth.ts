import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/verifyToken";

export const auth = (
    req : Request,
    res : Response,
    next : NextFunction
) => {
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                message : "No token provided"
            });
        }
        const token = authHeader.split(" ")[1];
        if(!token){
        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }
        try{
            const decoded = verifyToken(token);

            req.user = {
                id : decoded.id,
                email : decoded.email
            };
            next();
        }catch{
            res.status(401).json({
                message : "Invalid Token"
            });
        }
    };

    
