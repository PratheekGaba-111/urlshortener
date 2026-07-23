"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const result = dotenv_1.default.config();
console.log(result);
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.CLIENT_URL}/verify/${token}`;
    const mailOptions = {
        from: `"Shortify" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your Shortify Account",
        html: `
            <h2>Welcome to Shortify 👋</h2>

            <p>Thanks for registering!</p>

            <p>Please click the button below to verify your email.</p>

            <a
                href="${verificationLink}"
                style="
                    display:inline-block;
                    padding:12px 24px;
                    background:#2563eb;
                    color:#fff;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:bold;
                "
            >
                Verify Account
            </a>

            <p>This link expires in 1 hour.</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const mailOptions = {
        from: `"Shortify" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset your Shortify password",
        html: `
            <h2>Reset your password 🔐</h2>

            <p>We received a request to reset your Shortify password.</p>

            <p>Click the button below to choose a new password.</p>

            <a
                href="${resetLink}"
                style="
                    display:inline-block;
                    padding:12px 24px;
                    background:#7c3aed;
                    color:#fff;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:bold;
                "
            >
                Reset Password
            </a>

            <p>This link expires in 30 minutes.</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
