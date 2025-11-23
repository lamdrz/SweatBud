import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import posts from "./routes/posts.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(express.static('public')); // to serve static files from 'public' directory
app.use(cors());

// Load the /posts routes
app.use("/posts", posts);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});