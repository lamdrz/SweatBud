import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import auth from "./routes/auth.routes.js";
import users from "./routes/user.routes.js";
import events from "./routes/event.routes.js";
import sports from "./routes/sport.routes.js";
import chats from "./routes/chat.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend
  credentials: true,
}));
app.use(express.json()); // parse JSON bodies
app.use(cookieParser());
app.use(express.static('public')); // to serve static files from 'public' directory

// Routes
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/events", events);
app.use("/api/sports", sports);
app.use("/api/chats", chats);

export default app;