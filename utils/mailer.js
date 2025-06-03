import nodemailer from "nodemailer";
export const sendMail = async (to, subject, text) => {
    try {
        nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: process.env.MAILTRAP_SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAILTRAP_SMTP_USER, // generated ethereal user
                pass: process.env.MAILTRAP_SMTP_PASSWORD, // generated ethereal password
            },
        });

        const info = await transporter.sendMail({
            from: '"INNGEST MS',
            to,
            subject,
            text, // plain‑text body
            // html: "<b>Hello world?</b>", // HTML body
        });

        console.log("Message sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌Error sending email:", error);
        throw new Error("Failed to send email");
    }
};
