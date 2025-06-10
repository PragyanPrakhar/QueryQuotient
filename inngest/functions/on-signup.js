import { inngest } from "../client.js";
import User from "../../models/user.model.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import { generateWelcomeHtml } from "../../email-templates/welcome-email.js";
export const onUserSignup = inngest.createFunction(
    { id: "on-user-signup", retries: 2 },
    { event: "user/signup" },
    async ({ event, step }) => {
        try {
            if (!event.data?.email) {
                throw new NonRetriableError("Missing email in event data.");
            }
            const { email } = event.data;
            const user = await step.run("get-user-email", async () => {
                const userObj = await User.findOne({ email });
                if (!userObj) {
                    throw new NonRetriableError(
                        "User no longer exists in our database"
                    );
                }
                return userObj;
            });
            await step.run("send-welcome-email", async () => {
                const subject = `Welcome to our platform!`;
                const message = `Hi,
                \n\n
                Thanks for signing up on our platform. We are excited to have you on board.
                `;
                await sendMail(
                    user.email,
                    subject,
                    message,
                    generateWelcomeHtml({ username: user.username })
                );
            });
            return { success: true };
        } catch (error) {
            console.error("❌ Error running step on signup", error.message);
            return {
                success: false,
            };
        }
    }
);
