"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables.");
    process.exit(1); // Exit process if no MongoDB URI is found
}
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB via Mongoose"))
    .catch((err) => {
    console.error("MongoDB connection error:", err.message);
});
