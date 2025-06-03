import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["user", "moderator", "admin"],
        skills: [String],
        default: "user",
        createdAt: { type: Date, default: Date.now },
    },
});
export default mongoose.model("User", userSchema);
