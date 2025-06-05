import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import userRoutes from "./routes/userRouter.js";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

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
