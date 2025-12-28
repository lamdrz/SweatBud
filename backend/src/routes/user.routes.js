import express from "express";
import UserController from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authenticate, UserController.getOwnProfile);
router.get("/:id", authenticate, UserController.getProfile);

router.put("/me", authenticate, UserController.updateField);

export default router;