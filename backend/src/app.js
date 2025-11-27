import express from "express";
import dotenv from "dotenv";
import auth from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(express.static('public')); // to serve static files from 'public' directory

// Routes
app.use("/auth", auth);

export default app;