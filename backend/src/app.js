import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import auth from "./routes/auth.routes.js";
import users from "./routes/user.routes.js";

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

export default app;