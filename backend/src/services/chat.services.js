import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const getInbox = async (userId, type = null) => {
    let filters = { members: userId };
    if (type) {
        filters.type = type;
    }

    const query = await Conversation.find(filters)
        .sort({ updatedAt: -1 })
        .select('title lastMessage updatedAt')
        .populate('lastMessage', 'text sender readBy')
        .populate('members', 'username profilePicture')
        .lean();

    return query;
}

export const getConversationDetails = async (conversationId) => {
    const conversation = await Conversation.findById(conversationId)
        .populate('members', 'username profilePicture')
        .populate('groupAdmin', 'username profilePicture')
        .populate('lastMessage.readBy', 'username')
        .lean();

    return conversation;
}

export const getConversationMessages = async (conversationId) => {
    const query = await Message.find({ conversation: conversationId })
        .sort({ createdAt: 1 })
        .select('sender text medias createdAt')
        .populate('sender', 'username profilePicture')
        .lean();

    return query;
}