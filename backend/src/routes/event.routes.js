import express from 'express';
import EventController from '../controllers/event.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isEventOwner } from '../middleware/owner.middleware.js';

const router = express.Router();

// Public routes
router.get('/', EventController.getAll);
router.get('/:id', EventController.getById);

// Protected routes
router.post('/', authenticate, isEventOwner, EventController.create);
router.put('/:id', authenticate, isEventOwner, EventController.update);
router.delete('/:id', authenticate, isEventOwner, EventController.delete);

router.post('/:id/attend', authenticate, EventController.attend);
// router.get('/:id/attendees', EventController.getAttendees);

export default router;