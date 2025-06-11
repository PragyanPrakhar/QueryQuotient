import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {serve} from "inngest/express";
dotenv.config();
import cors from "cors";
import userRoutes from "./routes/userRouter.js";
import ticketRoutes from "./routes/ticketRouter.js";
import { inngest } from "./inngest/client.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";
import { onUserSignup } from "./inngest/functions/on-signup.js";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials: true, // Allow cookies to be sent
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }
));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use("/api/inngest",serve({
    client:inngest,
    functions: [onTicketCreated, onUserSignup],
}));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`🚀Server is running on port ${PORT}`);
        });
    })
    .catch((err) =>
        console.error(`❌Error connecting to MongoDB: ${err.message}`)
    );
