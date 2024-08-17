import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const user = process.env.EMAIL_USER_NAME;
const pass = process.env.EMAIL_USER_PASS;

const sendMail = async function sendMail(email, verificationToken) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });

  const Osubject = `Confirm Your Email Address`;
  const verificationUrl = `http://localhost:8000/api/auth/verify-email?token=${encodeURIComponent(
    verificationToken
  )}&email=${encodeURIComponent(email)}`;
  const Ohtml = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <h2 style="color: #333;">Welcome to Bihar Gallery!</h2>
      <p style="font-size: 16px; color: #555;">Thank you for registering with us. Please confirm your email address by clicking the button below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p style="font-size: 14px; color: #777;">If you did not create an account, no further action is required.</p>
      <p style="font-size: 14px; color: #777;">Best Regards,<br/>Bihar Gallery Team</p>
    </div>
  `;

  let info = await transporter.sendMail({
    from: `Bihar Gallery`,
    to: email, 
    subject: Osubject,
    html: Ohtml,
  });

  console.log("Message sent: %s", info.messageId);
};

export default sendMail;
