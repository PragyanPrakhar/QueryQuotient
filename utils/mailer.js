import nodemailer from "nodemailer";
export const sendMail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: process.env.MAILTRAP_SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: '"INNGEST MS',
            to,
            subject,
            text, // plain‑text body
            html, // HTML body
        });

        console.log("Message sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌Error sending email:", error);
        throw new Error("Failed to send email");
    }
};
