import dotenv from "dotenv";
import nodemailer from "nodemailer";

const result = dotenv.config();
console.log(result);

console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("EMAIL_PASS =", process.env.EMAIL_PASS ? "Loaded" : "Missing");
async function main() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to: process.env.EMAIL_USER!,
      subject: "SMTP Test",
      text: "Hello from Nodemailer",
    });

    console.log(info);
  } catch (err) {
    console.error(err);
  }
}

main();