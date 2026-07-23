import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email.service";
const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const toPublicUser = (user: { _id: unknown; name: string; email: string }) => ({
    id : user._id,
    name : user.name,
    email : user.email
});

export const register = async(
    req : Request, 
    res : Response
) : Promise<void> => {
    try{
        const {name, email, password} = req.body;

        if(!name?.trim() || !email?.trim() || !password){
            res.status(400).json({
                message : "Name, email, and password are required"
            });
            return;
        }

        if(!isValidEmail(email)){
            res.status(400).json({
                message : "A valid email is required"
            });
            return;
        }

        if(password.length < 6){
            res.status(400).json({
                message : "Password must be at least 6 characters"
            });
            return;
        }

        const withEmail = await User.findOne({email : email});
        if(withEmail){
            res.status(409).json({
                message : "User Already Exists"
            });
            return;
        } 
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpires = new Date(
            Date.now() + 60 * 60 * 1000
        );
        const user = await User.create({
            name,
            email,
            password,
            verified : false,    
            verificationToken,
            verificationTokenExpires
        });        
        const token = generateToken(user._id.toString());
        
        res.status(201).json({
            message : "User registered successfully",
            token,
            user : toPublicUser(user)
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

        if(!email?.trim() || !password){
            res.status(400).json({
                message : "Email and password are required"
            });
            return;
        }

        if(!isValidEmail(email)){
            res.status(400).json({
                message : "A valid email is required"
            });
            return;
        }

        const withEmail = await User.findOne({email});
        if(!withEmail){
            res.status(401).json({
                message : "Invalid credentials"
            });
            return;
        }
        if (!withEmail.verified) {
            res.status(403).json({
                message: "Please verify your email first."
            });
            return;
        }
        const compared = await withEmail.comparePassword(password);
        if(compared){
            const token = generateToken(withEmail._id.toString());
            res.status(200).json({
                message : "Login Successful!",
                token,
                user : toPublicUser(withEmail)
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

export const verifyEmail = async(
    req : Request,
    res : Response
) : Promise<void> => {
    const {token} = req.params;

    const user = await User.findOne({verificationToken : token, verificationTokenExpires : {$gt : new Date()}});

    if(!user){
        res.status(400).json({
            success : false,
            message : "Invalid or expired verification link."
        });
        return;
    }

    user.verified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.status(200).json({
        success : true,
        message : "Email verified successfully" 
    });
} 