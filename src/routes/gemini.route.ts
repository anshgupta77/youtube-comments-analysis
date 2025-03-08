import express, { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Comment from "../models/comments.model";

const router = express.Router();
const dotenv = require("dotenv").config();

// Initialize Gemini AI with API Key
const geminiApiKey: string | undefined = process.env.GEMINI_API_KEY;
// console.log("Gemini API Key:", geminiApiKey);

if (!geminiApiKey) {
  throw new Error("Gemini API key is missing. Check your .env file.");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.post("/analyze-comments", async (req: Request, res: Response) => {
  try {
    const { videoUrl }: { videoUrl: string } = req.body;
    const videoId: string | null = extractVideoId(videoUrl);
    var comments = await Comment.find({ sentiment: { $exists: false } });

    for (const comment of comments) {
      const sentiment: string = await analyzeSentiment(comment.text);
      if (sentiment !== "Unknown") {
        await Comment.updateOne({ _id: comment._id }, { $set: { sentiment } });
      }
    }
    comments = await Comment.find({ videoId });

    res.json({ message: "Sentiment analysis completed", comments });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error analyzing comments" });
  }
});

// Helper function to analyze sentiment using Gemini AI
const analyzeSentiment = async (text: string): Promise<string> => {
  try {
    const prompt: string = `Classify the following comment as 'Agree', 'Disagree', or 'Neutral'. Only respond with one word. Comment: "${text}"`;

    // Generate response using Gemini API
    const result = await model.generateContent(prompt);
    const responseText: string = result.response.text().trim();

    console.log("Gemini API Response:", responseText);

    if (["Agree", "Disagree", "Neutral"].includes(responseText)) {
      return responseText;
    }

    return "Unknown"; // Fallback for unexpected responses
  } catch (error: any) {
    console.error("Error analyzing sentiment:", error.message);
    return "Unknown"; // Return default if error occurs
  }
};


const extractVideoId = (url: string): string | null => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
};

export default router;
