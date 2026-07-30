import { Request, Response } from "express";
import User, { type IUser } from "../models/User";
import { generateToken } from "../utils/generateToken";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/email.service";
import { createPasswordResetToken, isPasswordResetTokenExpired } from "../utils/passwordReset";

const VERIFICATION_TOKEN_TTL_MS = 60 * 60 * 1000;

const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const toPublicUser = (user: { _id: unknown; name: string; email: string }) => ({
    id : user._id,
    name : user.name,
    email : user.email
});

const createVerificationToken = () => crypto.randomBytes(32).toString("hex");

const hasActiveVerificationToken = (user: IUser) => {
    return Boolean(
        user.verificationToken &&
        user.verificationTokenExpires &&
        user.verificationTokenExpires.getTime() > Date.now()
    );
};

const issueVerificationToken = async (user: IUser) => {
    if (hasActiveVerificationToken(user)) {
        return user.verificationToken as string;
    }

    user.verificationToken = createVerificationToken();
    user.verificationTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
    await user.save();

    return user.verificationToken;
};

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
        const user = await User.create({
            name,
            email,
            password,
            verified : false
        });

        try {
            const verificationToken = await issueVerificationToken(user);
            await sendVerificationEmail(user.email, verificationToken);
        } catch (emailError) {
            await User.deleteOne({ _id: user._id });
            throw emailError;
        }
        
        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email."
        });
    }catch(error){
        console.error(error);
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

        const compared = await withEmail.comparePassword(password);
        if(!compared){
            res.status(401).json({
                message : "Invalid credentials"
            });
            return;
        }

        if (!withEmail.verified) {
            res.status(403).json({
                success: false,
                code: "EMAIL_NOT_VERIFIED",
                message: "Please verify your email before signing in.",
                email: withEmail.email,
                canResendVerification: true
            });
            return;
        }

        const token = generateToken(withEmail._id.toString());
        res.status(200).json({
            success: true,
            message : "Login Successful!",
            token,
            user : toPublicUser(withEmail)
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const resendVerificationEmail = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email?.trim() || !isValidEmail(email)) {
            res.status(400).json({
                success: false,
                message: "A valid email is required"
            });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(200).json({
                success: true,
                message: "If an unverified account exists, a new verification email has been sent."
            });
            return;
        }

        if (user.verified) {
            res.status(200).json({
                success: true,
                message: "Your account is already verified. You can sign in now."
            });
            return;
        }

        const verificationToken = await issueVerificationToken(user);
        await sendVerificationEmail(user.email, verificationToken);

        res.status(200).json({
            success: true,
            message: "A new verification email has been sent."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

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
};

export const requestPasswordReset = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email?.trim() || !isValidEmail(email)) {
            res.status(400).json({
                success: false,
                message: "A valid email is required"
            });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(200).json({
                success: true,
                message: "If an account exists, a reset email has been sent."
            });
            return;
        }

        const resetToken = createPasswordResetToken();
        user.resetToken = resetToken;
        user.resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);
        await user.save();

        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({
            success: true,
            message: "If an account exists, a reset email has been sent."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const validatePasswordReset = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: new Date() }
        });

        if (!user || isPasswordResetTokenExpired(user.resetTokenExpires!)) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired reset link."
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Reset link is valid."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const resetPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
            return;
        }

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: new Date() }
        });

        if (!user || isPasswordResetTokenExpired(user.resetTokenExpires!)) {
            res.status(400).json({
                success: false,
                message: "Invalid or expired reset link."
            });
            return;
        }

        user.password = password;
        user.resetToken = null;
        user.resetTokenExpires = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
};
