import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
    },
});
transporter.verify((error, success) => {
    if(error){
        console.log("SMTP ERROR:", error);
    } else {
        console.log("SMTP READY");
    }
});
export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
    console.log("CLIENT_URL:", process.env.CLIENT_URL);
    //
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

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    console.log("RESET EMAIL:", email);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
    console.log("CLIENT_URL:", process.env.CLIENT_URL);

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
        from: `"Shortify" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset your Shortify password",
        html: `
            <h2>Reset your password 🔐</h2>
            <a href="${resetLink}">
                Reset Password
            </a>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("RESET MAIL SENT:", info.messageId);
    } catch(error) {
        console.error("RESET MAIL ERROR:", error);
        throw error;
    }
};