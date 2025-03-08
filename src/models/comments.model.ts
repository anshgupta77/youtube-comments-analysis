import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the comment document
interface IComment extends Document {
  videoId: string;
  commentId: string;
  maskedUsername: string;
  text: string;
  sentiment?: string; // Optional, since sentiment may not be assigned initially
  timestamp: Date;
}

// Define the Mongoose schema
const commentSchema = new Schema<IComment>({
  videoId: { type: String, required: true },
  commentId: { type: String, required: true },
  maskedUsername: { type: String, required: true },
  text: { type: String, required: true },
  sentiment: { type: String, enum: ["Agree", "Disagree", "Neutral"], default: undefined },
  timestamp: { type: Date, required: true },
});

// Export the Mongoose model with the interface
const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
