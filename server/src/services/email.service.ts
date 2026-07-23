import nodemailer from "nodemailer";
import dotenv from "dotenv";
const result = dotenv.config();
console.log(result);
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
    },
});

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
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