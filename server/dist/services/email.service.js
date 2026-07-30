"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("../config/env");
const APP_NAME = "Shortify";
const getRequiredEnv = (name) => {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};
const getClientUrl = () => getRequiredEnv("CLIENT_URL").replace(/\/$/, "");
const emailUser = getRequiredEnv("EMAIL_USER");
const emailPass = getRequiredEnv("EMAIL_PASS");
const smtpHost = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT?.trim() || "465");
const smtpSecure = process.env.SMTP_SECURE?.trim() !== undefined
    ? process.env.SMTP_SECURE.trim() === "true"
    : smtpPort === 465;
const transporter = nodemailer_1.default.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
        user: emailUser,
        pass: emailPass,
    },
});
const buildHtml = ({ headline, intro, ctaLabel, ctaUrl, ctaColor, closing, supportNote, }) => `
    <div style="background:#0f172a;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#e2e8f0;">
        <div style="max-width:560px;margin:0 auto;background:#111827;border:1px solid rgba(148,163,184,0.18);border-radius:20px;overflow:hidden;">
            <div style="padding:32px;">
                <div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#8b5cf6;font-weight:700;margin-bottom:18px;">
                    ${APP_NAME}
                </div>
                <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#ffffff;">
                    ${headline}
                </h1>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#cbd5e1;">
                    ${intro}
                </p>
                <a href="${ctaUrl}"
                   style="
                    display:inline-block;
                    padding:14px 24px;
                    background:${ctaColor};
                    color:white;
                    text-decoration:none;
                    border-radius:12px;
                    font-weight:700;
                   ">
                    ${ctaLabel}
                </a>
                <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#94a3b8;">
                    ${closing}
                </p>
                <p style="margin:14px 0 0;font-size:12px;line-height:1.7;color:#64748b;">
                    ${supportNote}
                </p>
            </div>
        </div>
    </div>
`;
const buildText = ({ headline, intro, ctaLabel, ctaUrl, closing, supportNote, }) => [
    APP_NAME,
    "",
    headline,
    intro,
    "",
    `${ctaLabel}: ${ctaUrl}`,
    "",
    closing,
    supportNote,
].join("\n");
const sendTemplateEmail = async (to, template) => {
    const info = await transporter.sendMail({
        from: `"${APP_NAME}" <${emailUser}>`,
        to,
        subject: template.subject,
        html: buildHtml(template),
        text: buildText(template),
    });
    return info.messageId;
};
const buildVerificationTemplate = (token) => {
    const clientUrl = getClientUrl();
    const verificationLink = `${clientUrl}/verify/${token}`;
    return {
        subject: "Verify your Shortify account",
        headline: "Verify your email address",
        intro: "Thanks for joining Shortify. Verify your account to activate login and start using your dashboard.",
        ctaLabel: "Verify account",
        ctaUrl: verificationLink,
        ctaColor: "#2563eb",
        closing: "This verification link expires in 1 hour.",
        supportNote: "If you did not create this account, you can safely ignore this email.",
    };
};
const buildPasswordResetTemplate = (token) => {
    const clientUrl = getClientUrl();
    const resetLink = `${clientUrl}/reset-password/${token}`;
    return {
        subject: "Reset your Shortify password",
        headline: "Reset your password",
        intro: "We received a request to reset your Shortify password. Use the button below to choose a new one.",
        ctaLabel: "Reset password",
        ctaUrl: resetLink,
        ctaColor: "#7c3aed",
        closing: "This password reset link expires in 30 minutes.",
        supportNote: "If you did not request a password reset, you can ignore this email.",
    };
};
const sendVerificationEmail = async (email, token) => {
    try {
        const messageId = await sendTemplateEmail(email, buildVerificationTemplate(token));
        console.log("Verification email sent:", messageId);
    }
    catch (error) {
        console.error("Verification email error:", error.message);
        throw error;
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendPasswordResetEmail = async (email, token) => {
    try {
        const messageId = await sendTemplateEmail(email, buildPasswordResetTemplate(token));
        console.log("Password reset email sent:", messageId);
    }
    catch (error) {
        console.error("Password reset email error:", error.message);
        throw error;
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
