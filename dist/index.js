"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const youtube_route_1 = __importDefault(require("./routes/youtube.route"));
const gemini_route_1 = __importDefault(require("./routes/gemini.route"));
require("./connection"); // Ensure this file initializes MongoDB connection
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
console.log("Server ", process.env.GEMINI_API_KEY);
console.log("Server ", process.env.YOUTUBE_API_KEY);
app.use("/api/youtube", youtube_route_1.default);
app.use("/api/gemini", gemini_route_1.default);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
