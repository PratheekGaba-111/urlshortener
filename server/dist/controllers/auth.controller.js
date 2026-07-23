"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const toPublicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email
});
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
        const user = await User_1.default.create({ name, email, password });
        const token = (0, generateToken_1.generateToken)(user._id.toString());
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: toPublicUser(user)
        });
    }
    catch (error) {
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
        if (compared) {
            const token = (0, generateToken_1.generateToken)(withEmail._id.toString());
            res.status(200).json({
                message: "Login Successful!",
                token,
                user: toPublicUser(withEmail)
            });
        }
        else {
            res.status(401).json({
                message: "Invalid credentials"
            });
            return;
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.login = login;
