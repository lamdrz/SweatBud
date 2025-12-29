import express from 'express';
import ConversationController from '../controllers/conversation.controller.js';
import MessageController from '../controllers/messages.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isGroupAdmin, isInGroup } from '../middleware/chat.middleware.js';

const router = express.Router();

// Conversations
router.get('/chats', authenticate, ConversationController.getInbox);
router.get('/chats/:id', authenticate, isInGroup, ConversationController.getById);
router.post('/chats', authenticate, ConversationController.create);
router.put("/chats/:id", authenticate, isGroupAdmin, ConversationController.update);

// Messages
router.get("/chats/:id/messages", authenticate, isInGroup, MessageController.getByConversation);
router.post("/chats/:id/messages", authenticate, isInGroup, MessageController.create);

export default router;