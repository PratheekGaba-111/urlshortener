import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";
export const register = async(
    req : Request, 
    res : Response
) : Promise<void> => {
    try{
        const {name, email, password} = req.body;
        const withEmail = await User.findOne({email : email});
        if(withEmail){
            res.status(409).json({
                message : "User Already Exists"
            });
            return;
        } 

        const user = await User.create({name, email, password});
        
        res.status(201).json({
            message : "User registered successfully",
            user : {
                id : user._id,
                name : user.name,
                email : user.email
            }
        });
    }catch(error){
        res.status(500).json({
            message : "Internal Server Error"
        });
    }
};
export const login = async(
    req : Request,
    res : Response
) : Promise<void> => {
    try{
        const {email, password} = req.body;
        const withEmail = await User.findOne({email});
        if(!withEmail){
            res.status(401).json({
                message : "Invalid credentials"
            });
            return;
        }
        // console.log(req.body);
        // console.log(withEmail);
        const compared = await withEmail.comparePassword(password);
        console.log(compared);
        if(compared){
            const token = generateToken(withEmail._id.toString());
            res.status(200).json({
                message : "Login Successful!",
                token
            })
        }
        else{
            res.status(401).json({
                message : "Invalid credentials"
            });
            return;
        }

    }catch(error){
        console.log(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}