"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
const brevo_1 = require("@getbrevo/brevo");
require("../config/env");
const APP_NAME = "Shortify";
const getRequiredEnv = (name) => {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};
const MAIL_DEBUG = process.env.MAIL_DEBUG?.trim() === "true";
let brevoClientPromise = null;
const debugEmail = (...args) => {
    if (MAIL_DEBUG) {
        console.log("[mail-debug]", ...args);
    }
};
const maskValue = (value, visibleStart = 3, visibleEnd = 3) => {
    if (value.length <= visibleStart + visibleEnd) {
        return "***";
    }
    return `${value.slice(0, visibleStart)}***${value.slice(-visibleEnd)}`;
};
const serializeEmailError = (error) => {
    if (!(error instanceof Error)) {
        return { error };
    }
    const anyError = error;
    return {
        name: anyError.name,
        message: anyError.message,
        code: anyError.code,
        response: anyError.response,
        command: anyError.command,
        errno: anyError.errno,
        stack: anyError.stack,
    };
};
const loadMailerConfig = () => {
    const apiKey = process.env.BREVO_API_KEY?.trim();
    const emailFrom = process.env.EMAIL_FROM?.trim() ||
        "";
    if (!apiKey) {
        throw new Error("Missing Brevo API key. Set BREVO_API_KEY.");
    }
    if (!emailFrom) {
        throw new Error("Missing sender email. Set EMAIL_FROM to a verified sender address.");
    }
    debugEmail("loaded config", {
        apiKey: maskValue(apiKey),
        emailFrom,
        clientUrl: getRequiredEnv("CLIENT_URL").replace(/\/$/, ""),
    });
    return {
        clientUrl: getRequiredEnv("CLIENT_URL").replace(/\/$/, ""),
        apiKey,
        emailFrom,
    };
};
const getClientUrl = () => loadMailerConfig().clientUrl;
const getBrevoClient = async () => {
    if (!brevoClientPromise) {
        brevoClientPromise = (async () => {
            const config = loadMailerConfig();
            debugEmail("creating brevo client", {
                emailFrom: config.emailFrom,
                clientUrl: config.clientUrl,
            });
            return new brevo_1.BrevoClient({
                apiKey: config.apiKey,
                timeoutInSeconds: 30,
                maxRetries: 1,
            });
        })().catch((error) => {
            debugEmail("brevo client init failed", serializeEmailError(error));
            brevoClientPromise = null;
            throw error;
        });
    }
    return brevoClientPromise;
};
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
    const brevo = await getBrevoClient();
    const { emailFrom } = loadMailerConfig();
    debugEmail("sending email", {
        to,
        from: emailFrom,
        subject: template.subject,
        ctaUrl: template.ctaUrl,
    });
    const response = await brevo.transactionalEmails.sendTransacEmail({
        sender: {
            email: emailFrom,
            name: APP_NAME,
        },
        to: [{ email: to }],
        subject: template.subject,
        htmlContent: buildHtml(template),
        textContent: buildText(template),
    });
    debugEmail("sendMail succeeded", {
        messageId: response.messageId,
    });
    return response.messageId ?? response.messageIds?.[0] ?? "brevo-api-email-sent";
};
const getFriendlyEmailError = (error) => {
    if (!(error instanceof Error)) {
        return "Email delivery failed";
    }
    const anyError = error;
    const message = anyError.message || "Email delivery failed";
    const response = anyError.response || "";
    const code = anyError.code || "";
    const combined = `${message} ${response}`;
    if (anyError.statusCode === 401 || anyError.statusCode === 403) {
        return "Brevo API authentication failed. Make sure BREVO_API_KEY is valid.";
    }
    if (/unauthorized|forbidden|api key/i.test(combined)) {
        return "Brevo API authentication failed. Make sure BREVO_API_KEY is valid.";
    }
    if (/timed out/i.test(combined)) {
        return "Brevo API request timed out. This usually means the request could not complete in time.";
    }
    if (/network|fetch|econnreset|socket hang up/i.test(combined)) {
        return "Brevo API request failed due to a network issue.";
    }
    return message;
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
        const friendlyError = getFriendlyEmailError(error);
        console.error("Verification email error:", friendlyError);
        debugEmail("verification email raw error", serializeEmailError(error));
        throw new Error(friendlyError);
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendPasswordResetEmail = async (email, token) => {
    try {
        const messageId = await sendTemplateEmail(email, buildPasswordResetTemplate(token));
        console.log("Password reset email sent:", messageId);
    }
    catch (error) {
        const friendlyError = getFriendlyEmailError(error);
        console.error("Password reset email error:", friendlyError);
        debugEmail("password reset raw error", serializeEmailError(error));
        throw new Error(friendlyError);
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
