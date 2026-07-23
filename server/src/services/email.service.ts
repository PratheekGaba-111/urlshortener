import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
});
export const sendVerificationEmail = async (
    email : string, 
    token : string
) => {
    try{
        const verificationLink = `${process.env.CLIENT_URL}/verify/${token}`;
        const mailOptions = {
            from : process.env.EMAIL_USER,
            to : email,
            subject : "Verify your Shortify Account Now!!",
            html : `
                <h2>Welcome to Shortify 👋</h2>

                <p>Click the button below to verify your email.</p>

                <a href="${verificationLink}">
                    Verify Account
                </a>
            `
        };
        await transporter.sendMail(mailOptions);
    }
    catch(error){
        console.error('Email sending failed: ', error);
        throw error;
    }
};
