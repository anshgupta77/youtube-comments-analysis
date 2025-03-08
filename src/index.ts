import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import youtubeRoute from "./routes/youtube.route";
import geminiRoute from "./routes/gemini.route";
import "./connection"; // Ensure this file initializes MongoDB connection

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use(cors());

console.log("Server ", process.env.GEMINI_API_KEY);
console.log("Server ", process.env.YOUTUBE_API_KEY);

app.use("/api/youtube", youtubeRoute);
app.use("/api/gemini", geminiRoute);

const PORT: number = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
