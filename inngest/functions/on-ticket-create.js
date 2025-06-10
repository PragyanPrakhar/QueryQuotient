import { inngest } from "../client.js";
import Ticket from "../../models/ticket.model.js";
import User from "../../models/user.model.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import { generateWelcomeHtml } from "../../email-templates/welcome-email.js";
import analyzeTicket from "../../utils/ai-agent.js";
import { generateTicketAssignedHtml } from "../../email-templates/ticket-assigned.js";
import { format } from "date-fns";

export const onTicketCreated = inngest.createFunction(
    { id: "on-ticket-created", retries: 2 },
    { event: "ticket/created" },
    async ({ event, data,step }) => {
        try {
            const { ticketId } = event.data;
            /* if (!ticketId) {
                throw new NonRetriableError("Missing ticketId in event data.");
            } */
            const ticket = await step.run("fetch-ticket", async () => {
                const ticketObject = await Ticket.findById(ticketId);
                if (!ticketObject) {
                    throw new NonRetriableError(
                        "Ticket no longer exists in our database"
                    );
                }
                return ticketObject;
            });

            console.log("Ticket found:", ticket);

            await step.run("update-ticket-status", async () => {
                await Ticket.findByIdAndUpdate(ticket._id, {
                    status: "open",
                });
            });

            console.log("Ticket status updated to open");

            const aiResponse = await analyzeTicket(ticket);

            console.log("AI response received:", aiResponse);
            const relatedSkills = await step.run("ai-processing", async () => {
                //TODO:It has been returned null previously but I have updated the return value of analyzeTicket function to return an object with error, data and message properties.
                if (aiResponse.error) {
                    throw new NonRetriableError(
                        "AI processing failed: " + aiResponse.message
                    );
                }
                let skills = [];
                await Ticket.findByIdAndUpdate(ticket._id, {
                    relatedSkills: aiResponse.relatedSkills,
                    helpfulNotes: aiResponse.helpfulNotes,
                    priority: !["low", "medium", "high"].includes(
                        aiResponse.priority
                    )
                        ? "medium"
                        : aiResponse.priority,
                    status: "in-progress",
                });
                skills = aiResponse.relatedSkills;
                return skills;
            });

            const moderator = await step.run("assign-moderator", async () => {
                let user = await User.findOne({
                    role: "moderator",
                    skills: {
                        $elemMatch: {
                            $regex: relatedSkills.join("|"),
                            $options: "i",
                        },
                    },
                });
                if (!user) {
                    user = await User.findOne({
                        role: "admin",
                    });
                }
                await Ticket.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id || null,
                });
                return user;
            });
            await step.run("send-email-notification", async () => {
                if (moderator) {
                    const finalTicket = await Ticket.findById(ticket._id);
                    await sendMail(
                        moderator.email,
                        "Ticket Assigned",
                        `A new ticket has been assigned to you: ${finalTicket.title}`,
                        generateTicketAssignedHtml({
                            moderatorName: moderator.username,
                            ticketTitle: finalTicket.title,
                            ticketDescription: finalTicket.description,
                            ticketDate: format(
                                ticket.createdAt,
                                "dd MMM yyyy, hh:mm a"
                            ),
                        })
                    );
                }
            });
            return { success: true };
        } catch (error) {
            console.error("❌ Error running step while Assigning ticket and sending mail to moderator", error.message);
            return {
                success: false,
                error: error.message,
            };
        }
    }
);
