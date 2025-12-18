import express from 'express';
import SportController from '../controllers/sport.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// Public routes
router.get('/', SportController.getAll);
router.get('/:id', SportController.getById);

// Protected routes
router.post('/', authenticate, authorize('admin'), SportController.create);

export default router;