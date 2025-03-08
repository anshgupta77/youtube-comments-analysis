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
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const comments_model_1 = __importDefault(require("../models/comments.model"));
const router = (0, express_1.Router)();
const dotenv = require("dotenv").config();
console.log("Server ", process.env.YOUTUBE_API_KEY);
router.post("/fetch-comments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { videoUrl } = req.body;
        const videoId = extractVideoId(videoUrl);
        const apiKey = process.env.YOUTUBE_API_KEY;
        const maxResults = 15;
        if (!videoId) {
            res.status(400).json({ error: "Invalid URL" });
            return; // End the function after sending the response
        }
        if (!apiKey) {
            res.status(500).json({ error: "API Key is missing" });
            return; // End the function after sending the response
        }
        const response = yield axios_1.default.get("https://www.googleapis.com/youtube/v3/commentThreads", {
            params: {
                part: "snippet",
                videoId,
                key: apiKey,
                maxResults,
            },
        });
        const comments = response.data.items.map((item) => {
            const comment = item.snippet.topLevelComment.snippet;
            return {
                videoId,
                commentId: item.id,
                maskedUsername: maskUsername(comment.authorDisplayName),
                text: comment.textOriginal,
                timestamp: comment.publishedAt,
            };
        });
        yield comments_model_1.default.insertMany(comments);
        res.json({ message: "Comments fetched and stored", comments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching comments" });
    }
}));
const extractVideoId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
};
const maskUsername = (username) => {
    return username.replace(/./g, "").slice(0, 3) + "*";
};
exports.default = router;
