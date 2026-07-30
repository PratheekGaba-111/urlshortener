import nodemailer from "nodemailer";
import "../config/env";

const APP_NAME = "Shortify";

const getRequiredEnv = (name: string) => {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

type MailerConfig = {
    clientUrl: string;
    emailUser: string;
    emailPass: string;
    emailFrom: string;
    smtpHost: string;
    smtpPort: number;
    smtpSecure: boolean;
};

const SMTP_OPERATION_TIMEOUT_MS = 15000;
const MAIL_DEBUG = process.env.MAIL_DEBUG?.trim() === "true";
let transporterPromise: Promise<nodemailer.Transporter> | null = null;

const debugEmail = (...args: unknown[]) => {
    if (MAIL_DEBUG) {
        console.log("[mail-debug]", ...args);
    }
};

const maskValue = (value: string, visibleStart = 3, visibleEnd = 3) => {
    if (value.length <= visibleStart + visibleEnd) {
        return "***";
    }

    return `${value.slice(0, visibleStart)}***${value.slice(-visibleEnd)}`;
};

const serializeEmailError = (error: unknown) => {
    if (!(error instanceof Error)) {
        return { error };
    }

    const anyError = error as Error & {
        code?: string;
        response?: string;
        command?: string;
        errno?: number;
    };

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

const loadMailerConfig = (): MailerConfig => {
    const smtpHost =
        process.env.SMTP_HOST?.trim() || "smtp-relay.brevo.com";
    const smtpPortRaw = process.env.SMTP_PORT?.trim() || "587";
    const smtpPort = Number(smtpPortRaw);

    if (Number.isNaN(smtpPort) || smtpPort <= 0) {
        throw new Error(`Invalid SMTP_PORT value: ${smtpPortRaw}`);
    }

    const smtpSecureEnv = process.env.SMTP_SECURE?.trim();
    const brevoLogin = process.env.BREVO_SMTP_LOGIN?.trim();
    const brevoKey = process.env.BREVO_SMTP_KEY?.trim();
    const emailUser = brevoLogin || process.env.EMAIL_USER?.trim();
    const emailPass = brevoKey || process.env.EMAIL_PASS?.trim();
    const emailFrom =
        process.env.EMAIL_FROM?.trim() ||
        process.env.EMAIL_USER?.trim() ||
        brevoLogin ||
        "";

    if (!emailUser) {
        throw new Error(
            "Missing SMTP login. Set BREVO_SMTP_LOGIN or EMAIL_USER."
        );
    }

    if (!emailPass) {
        throw new Error(
            "Missing SMTP password. Set BREVO_SMTP_KEY or EMAIL_PASS."
        );
    }

    if (!emailFrom) {
        throw new Error(
            "Missing sender email. Set EMAIL_FROM to a verified sender address."
        );
    }

    debugEmail("loaded config", {
        smtpHost,
        smtpPort,
        smtpSecure: smtpSecureEnv !== undefined ? smtpSecureEnv === "true" : smtpPort === 465,
        emailUser: maskValue(emailUser),
        emailFrom,
        clientUrl: getRequiredEnv("CLIENT_URL").replace(/\/$/, ""),
    });

    return {
        clientUrl: getRequiredEnv("CLIENT_URL").replace(/\/$/, ""),
        emailUser,
        emailPass,
        emailFrom,
        smtpHost,
        smtpPort,
        smtpSecure:
            smtpSecureEnv !== undefined
                ? smtpSecureEnv === "true"
                : smtpPort === 465,
    };
};

const getClientUrl = () => loadMailerConfig().clientUrl;

const getTransporter = async () => {
    if (!transporterPromise) {
        transporterPromise = (async () => {
            const config = loadMailerConfig();
            debugEmail("creating transporter", {
                host: config.smtpHost,
                port: config.smtpPort,
                secure: config.smtpSecure,
            });
            const transporter = nodemailer.createTransport({
                host: config.smtpHost,
                port: config.smtpPort,
                secure: config.smtpSecure,
                connectionTimeout: SMTP_OPERATION_TIMEOUT_MS,
                greetingTimeout: SMTP_OPERATION_TIMEOUT_MS,
                socketTimeout: SMTP_OPERATION_TIMEOUT_MS,
                auth: {
                    user: config.emailUser,
                    pass: config.emailPass,
                },
            });

            debugEmail("verifying SMTP connection");
            await Promise.race([
                transporter.verify(),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("SMTP verification timed out")),
                        SMTP_OPERATION_TIMEOUT_MS
                    )
                ),
            ]);
            console.log(
                `[email] SMTP ready for ${config.smtpHost}:${config.smtpPort}`
            );
            debugEmail("SMTP verify succeeded");

            return transporter;
        })().catch((error) => {
            debugEmail("SMTP verify failed", serializeEmailError(error));
            transporterPromise = null;
            throw error;
        });
    }

    return transporterPromise;
};

type EmailTemplate = {
    subject: string;
    headline: string;
    intro: string;
    ctaLabel: string;
    ctaUrl: string;
    ctaColor: string;
    closing: string;
    supportNote: string;
};

const buildHtml = ({
    headline,
    intro,
    ctaLabel,
    ctaUrl,
    ctaColor,
    closing,
    supportNote,
}: EmailTemplate) => `
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

const buildText = ({
    headline,
    intro,
    ctaLabel,
    ctaUrl,
    closing,
    supportNote,
}: EmailTemplate) =>
    [
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

const sendTemplateEmail = async (to: string, template: EmailTemplate) => {
    const transporter = await getTransporter();
    const { emailFrom } = loadMailerConfig();

    debugEmail("sending email", {
        to,
        from: emailFrom,
        subject: template.subject,
        ctaUrl: template.ctaUrl,
    });

    const info = await Promise.race([
        transporter.sendMail({
            from: `"${APP_NAME}" <${emailFrom}>`,
            to,
            subject: template.subject,
            html: buildHtml(template),
            text: buildText(template),
        }),
        new Promise<never>((_, reject) =>
            setTimeout(
                () => reject(new Error("SMTP send timed out")),
                SMTP_OPERATION_TIMEOUT_MS
            )
        ),
    ]);

    const sentInfo = info as nodemailer.SentMessageInfo;
    debugEmail("sendMail succeeded", {
        messageId: sentInfo.messageId,
        accepted: sentInfo.accepted,
        rejected: sentInfo.rejected,
        response: sentInfo.response,
    });

    return sentInfo.messageId;
};

const getFriendlyEmailError = (error: unknown) => {
    if (!(error instanceof Error)) {
        return "Email delivery failed";
    }

    const anyError = error as Error & {
        code?: string;
        response?: string;
    };

    const message = anyError.message || "Email delivery failed";
    const response = anyError.response || "";
    const code = anyError.code || "";
    const combined = `${message} ${response}`;

    if (code === "EAUTH" || /auth|login|password/i.test(combined)) {
        return "SMTP authentication failed. For Brevo, use BREVO_SMTP_LOGIN as the username and BREVO_SMTP_KEY as the password.";
    }

    if (code === "ECONNECTION" || code === "ETIMEDOUT" || code === "ECONNREFUSED") {
        return "SMTP connection failed. For Brevo, check SMTP_HOST=smtp-relay.brevo.com, SMTP_PORT=587, SMTP_SECURE=false, and outbound network access on Render.";
    }

    if (/timed out/i.test(combined)) {
        return "SMTP request timed out. This usually means the host could not complete the connection or handshake in time.";
    }

    if (/ENOTFOUND|getaddrinfo/i.test(combined)) {
        return "SMTP host could not be resolved. Check SMTP_HOST.";
    }

    return message;
};

const buildVerificationTemplate = (token: string): EmailTemplate => {
    const clientUrl = getClientUrl();
    const verificationLink = `${clientUrl}/verify/${token}`;

    return {
        subject: "Verify your Shortify account",
        headline: "Verify your email address",
        intro:
            "Thanks for joining Shortify. Verify your account to activate login and start using your dashboard.",
        ctaLabel: "Verify account",
        ctaUrl: verificationLink,
        ctaColor: "#2563eb",
        closing: "This verification link expires in 1 hour.",
        supportNote:
            "If you did not create this account, you can safely ignore this email.",
    };
};

const buildPasswordResetTemplate = (token: string): EmailTemplate => {
    const clientUrl = getClientUrl();
    const resetLink = `${clientUrl}/reset-password/${token}`;

    return {
        subject: "Reset your Shortify password",
        headline: "Reset your password",
        intro:
            "We received a request to reset your Shortify password. Use the button below to choose a new one.",
        ctaLabel: "Reset password",
        ctaUrl: resetLink,
        ctaColor: "#7c3aed",
        closing: "This password reset link expires in 30 minutes.",
        supportNote:
            "If you did not request a password reset, you can ignore this email.",
    };
};

export const sendVerificationEmail = async (email: string, token: string) => {
    try {
        const messageId = await sendTemplateEmail(
            email,
            buildVerificationTemplate(token)
        );

        console.log("Verification email sent:", messageId);
    } catch (error: any) {
        const friendlyError = getFriendlyEmailError(error);
        console.error("Verification email error:", friendlyError);
        debugEmail("verification email raw error", serializeEmailError(error));
        throw new Error(friendlyError);
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    try {
        const messageId = await sendTemplateEmail(
            email,
            buildPasswordResetTemplate(token)
        );

        console.log("Password reset email sent:", messageId);
    } catch (error: any) {
        const friendlyError = getFriendlyEmailError(error);
        console.error("Password reset email error:", friendlyError);
        debugEmail("password reset raw error", serializeEmailError(error));
        throw new Error(friendlyError);
    }
};
