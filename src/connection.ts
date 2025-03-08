import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI: string | undefined = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables.");
    process.exit(1); // Exit process if no MongoDB URI is found
}

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB via Mongoose"))
    .catch((err: Error) => {
        console.error("MongoDB connection error:", err.message);
    });
