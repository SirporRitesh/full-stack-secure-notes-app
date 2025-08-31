import nodemailer from "nodemailer";
// Configure the transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});
export async function sendOtpEmail(toEmail, otp) {
    const mailOptions = {
        from: '"HDNotes Application" <support@hdnotesapplication.app>',
        to: toEmail,
        subject: "Your OTP Code",
        html: `
      <p>Hello,</p>
      <p>Your OTP code is: <b>${otp}</b></p>
      <p>This code will expire in 10 minutes.</p>
    `,
        text: `Your OTP code is: ${otp}`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to ${toEmail}`);
    }
    catch (err) {
        console.error("❌ Error sending email:", err);
        // Optionally, throw the error to handle elsewhere
        // throw new Error('Failed to send OTP email.');
    }
}
//# sourceMappingURL=sendEmail.js.map