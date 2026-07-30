"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.validatePasswordReset = exports.requestPasswordReset = exports.verifyEmail = exports.resendVerificationEmail = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
const crypto_1 = __importDefault(require("crypto"));
const email_service_1 = require("../services/email.service");
const passwordReset_1 = require("../utils/passwordReset");
const VERIFICATION_TOKEN_TTL_MS = 60 * 60 * 1000;
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const toPublicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email
});
const createVerificationToken = () => crypto_1.default.randomBytes(32).toString("hex");
const hasActiveVerificationToken = (user) => {
    return Boolean(user.verificationToken &&
        user.verificationTokenExpires &&
        user.verificationTokenExpires.getTime() > Date.now());
};
const issueVerificationToken = async (user) => {
    if (hasActiveVerificationToken(user)) {
        return user.verificationToken;
    }
    user.verificationToken = createVerificationToken();
    user.verificationTokenExpires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
    await user.save();
    return user.verificationToken;
};
const queueEmailSend = (label, task) => {
    task.catch((error) => {
        console.error(`${label} failed:`, error);
    });
};
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name?.trim() || !email?.trim() || !password) {
            res.status(400).json({
                message: "Name, email, and password are required"
            });
            return;
        }
        if (!isValidEmail(email)) {
            res.status(400).json({
                message: "A valid email is required"
            });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({
                message: "Password must be at least 6 characters"
            });
            return;
        }
        const withEmail = await User_1.default.findOne({ email: email });
        if (withEmail) {
            res.status(409).json({
                message: "User Already Exists"
            });
            return;
        }
        const user = await User_1.default.create({
            name,
            email,
            password,
            verified: false
        });
        const verificationToken = await issueVerificationToken(user);
        queueEmailSend("Verification email", (0, email_service_1.sendVerificationEmail)(user.email, verificationToken));
        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email."
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password) {
            res.status(400).json({
                message: "Email and password are required"
            });
            return;
        }
        if (!isValidEmail(email)) {
            res.status(400).json({
                message: "A valid email is required"
            });
            return;
        }
        const withEmail = await User_1.default.findOne({ email });
        if (!withEmail) {
            res.status(401).json({
                message: "Invalid credentials"
            });
            return;
        }
        const compared = await withEmail.comparePassword(password);
        if (!compared) {
            res.status(401).json({
                message: "Invalid credentials"
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
        const token = (0, generateToken_1.generateToken)(withEmail._id.toString());
        res.status(200).json({
            success: true,
            message: "Login Successful!",
            token,
            user: toPublicUser(withEmail)
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.login = login;
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email?.trim() || !isValidEmail(email)) {
            res.status(400).json({
                success: false,
                message: "A valid email is required"
            });
            return;
        }
        const user = await User_1.default.findOne({ email });
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
        queueEmailSend("Verification resend", (0, email_service_1.sendVerificationEmail)(user.email, verificationToken));
        res.status(200).json({
            success: true,
            message: "A new verification email has been sent."
        });
    }
    catch (error) {
        console.error("Failed to resend verification email:", error);
        res.status(503).json({
            success: false,
            message: "Verification email could not be sent right now. Please try again later."
        });
    }
};
exports.resendVerificationEmail = resendVerificationEmail;
const verifyEmail = async (req, res) => {
    const { token } = req.params;
    const user = await User_1.default.findOne({ verificationToken: token, verificationTokenExpires: { $gt: new Date() } });
    if (!user) {
        res.status(400).json({
            success: false,
            message: "Invalid or expired verification link."
        });
        return;
    }
    user.verified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Email verified successfully"
    });
};
exports.verifyEmail = verifyEmail;
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email?.trim() || !isValidEmail(email)) {
            res.status(400).json({
                success: false,
                message: "A valid email is required"
            });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(200).json({
                success: true,
                message: "If an account exists, a reset email has been sent."
            });
            return;
        }
        const resetToken = (0, passwordReset_1.createPasswordResetToken)();
        user.resetToken = resetToken;
        user.resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);
        await user.save();
        queueEmailSend("Password reset email", (0, email_service_1.sendPasswordResetEmail)(user.email, resetToken));
        res.status(200).json({
            success: true,
            message: "If an account exists, a reset email has been sent."
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.requestPasswordReset = requestPasswordReset;
const validatePasswordReset = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User_1.default.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: new Date() }
        });
        if (!user || (0, passwordReset_1.isPasswordResetTokenExpired)(user.resetTokenExpires)) {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.validatePasswordReset = validatePasswordReset;
const resetPassword = async (req, res) => {
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
        const user = await User_1.default.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: new Date() }
        });
        if (!user || (0, passwordReset_1.isPasswordResetTokenExpired)(user.resetTokenExpires)) {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.resetPassword = resetPassword;
