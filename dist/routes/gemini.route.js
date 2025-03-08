"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const comments_model_1 = __importDefault(require("../models/comments.model"));
const router = express_1.default.Router();
const dotenv = require("dotenv").config();
// Initialize Gemini AI with API Key
const geminiApiKey = process.env.GEMINI_API_KEY;
// console.log("Gemini API Key:", geminiApiKey);
if (!geminiApiKey) {
    throw new Error("Gemini API key is missing. Check your .env file.");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
router.post("/analyze-comments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoUrl } = req.body;
        const videoId = extractVideoId(videoUrl);
        var comments = yield comments_model_1.default.find({ sentiment: { $exists: false }, videoId });
        for (const comment of comments) {
            const sentiment = yield analyzeSentiment(comment.text);
            if (sentiment !== "Unknown") {
                yield comments_model_1.default.updateOne({ _id: comment._id }, { $set: { sentiment } });
            }
        }
        comments = yield comments_model_1.default.find({ sentiment: { $exists: true } });
        res.json({ message: "Sentiment analysis completed", comments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error analyzing comments" });
    }
}));
// Helper function to analyze sentiment using Gemini AI
const analyzeSentiment = (text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prompt = `Classify the following comment as 'Agree', 'Disagree', or 'Neutral'. Only respond with one word. Comment: "${text}"`;
        // Generate response using Gemini API
        const result = yield model.generateContent(prompt);
        const responseText = result.response.text().trim();
        console.log("Gemini API Response:", responseText);
        if (["Agree", "Disagree", "Neutral"].includes(responseText)) {
            return responseText;
        }
        return "Unknown"; // Fallback for unexpected responses
    }
    catch (error) {
        console.error("Error analyzing sentiment:", error.message);
        return "Unknown"; // Return default if error occurs
    }
});
const extractVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
};
exports.default = router;
