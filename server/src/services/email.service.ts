import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});
// Check SMTP connection when server starts
transporter.verify()
    .then(() => {
        console.log("SMTP READY");
    })
    .catch((error) => {
        console.error("SMTP ERROR:", error.message);
    });


export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    try {
        const verificationLink =
            `${process.env.CLIENT_URL}/verify/${token}`;

        const mailOptions = {
            from: `"Shortify" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your Shortify Account",
            html: `
                <h2>Welcome to Shortify 👋</h2>

                <p>Thanks for registering!</p>

                <p>Please verify your email by clicking below:</p>

                <a href="${verificationLink}"
                   style="
                    display:inline-block;
                    padding:12px 24px;
                    background:#2563eb;
                    color:white;
                    text-decoration:none;
                    border-radius:8px;
                   ">
                    Verify Account
                </a>

                <p>This link expires in 1 hour.</p>
            `,
        };

        console.log("Sending verification email to:", email);

        const info = await transporter.sendMail(mailOptions);

        console.log(
            "VERIFICATION MAIL SENT:",
            info.messageId
        );

    } catch (error: any) {
        console.error(
            "VERIFICATION EMAIL ERROR:",
            error.message
        );
        throw error;
    }
};


export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    try {
        console.log("RESET EMAIL:", email);
        console.log(
            "EMAIL_USER:",
            process.env.EMAIL_USER
        );
        console.log(
            "EMAIL_PASS exists:",
            !!process.env.EMAIL_PASS
        );
        console.log(
            "CLIENT_URL:",
            process.env.CLIENT_URL
        );


        const resetLink =
            `${process.env.CLIENT_URL}/reset-password/${token}`;


        const mailOptions = {
            from: `"Shortify" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset your Shortify password",
            html: `
                <h2>Reset your password 🔐</h2>

                <p>
                    We received a request to reset your password.
                </p>

                <a href="${resetLink}"
                   style="
                    display:inline-block;
                    padding:12px 24px;
                    background:#7c3aed;
                    color:white;
                    text-decoration:none;
                    border-radius:8px;
                   ">
                    Reset Password
                </a>

                <p>
                    This link expires in 30 minutes.
                </p>
            `,
        };


        console.log("Sending reset email...");

        const info = await transporter.sendMail(mailOptions);


        console.log(
            "RESET MAIL SENT:",
            info.messageId
        );


    } catch (error: any) {

        console.error(
            "RESET MAIL ERROR:",
            error.message
        );

        console.error(error);

        throw error;
    }
};  