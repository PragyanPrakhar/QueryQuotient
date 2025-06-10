import mongoose from "mongoose";
const ticketSchema = new mongoose.Schema({
    title: String,
    type: String,
    description: String,
    status: {
        type: String,
        enum: ["open", "in-progress", "closed"],
        default: "open",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    priority: String,
    deadline: Date,
    helpfulNotes: String,
    relatedSkills: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export default mongoose.model("Ticket", ticketSchema);
