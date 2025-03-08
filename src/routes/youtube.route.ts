



import express, { Request, Response, Router } from "express";
import axios from "axios";
import Comment from "../models/comments.model";

const router = Router();
const dotenv = require("dotenv").config();


console.log("Server ", process.env.YOUTUBE_API_KEY);

router.post("/fetch-comments", async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoUrl }: { videoUrl: string } = req.body;
    const videoId: string | null = extractVideoId(videoUrl);
    const apiKey: string | undefined = process.env.YOUTUBE_API_KEY;

    const maxResults: number = 15;

    if (!videoId) {
      res.status(400).json({ error: "Invalid URL" });
      return; // End the function after sending the response
    }
    if (!apiKey) {
      res.status(500).json({ error: "API Key is missing" });
      return; // End the function after sending the response
    }

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/commentThreads",
      {
        params: {
          part: "snippet",
          videoId,
          key: apiKey,
          maxResults,
        },
      }
    );

    const comments = response.data.items.map((item: any) => {
      const comment = item.snippet.topLevelComment.snippet;
      return {
        videoId,
        commentId: item.id,
        maskedUsername: maskUsername(comment.authorDisplayName),
        text: comment.textOriginal,
        timestamp: comment.publishedAt,
      };
    });

    await Comment.insertMany(comments);
    res.json({ message: "Comments fetched and stored", comments });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Error fetching comments" });
  }
});

const extractVideoId = (url: string): string | null => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
};

const maskUsername = (username: string): string => {
  return username.replace(/./g, "").slice(0, 3) + "*";
};

export default router;