import express from 'express';
import ConversationController from '../controllers/conversation.controller.js';
import MessageController from '../controllers/messages.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isGroupAdmin, isInGroup } from '../middleware/chat.middleware.js';

const router = express.Router();

// Conversations
router.get('/', authenticate, ConversationController.getInbox);
router.get('/:id', authenticate, isInGroup, ConversationController.getById);
router.post('/:userId', authenticate, ConversationController.startPrivateChat);
router.put("/:id", authenticate, isGroupAdmin, ConversationController.update);

// Messages
router.get("/:id/messages", authenticate, isInGroup, MessageController.getByConversation);
router.post("/:id/messages", authenticate, isInGroup, MessageController.create);

export default router;