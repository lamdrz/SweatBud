import Conversation from "../models/conversation.model";

export const isInGroup = async (req, res, next) => {
    const conversationId = req.params.id;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.members.some(memberId => memberId.toString() === userId)) {
        return res.status(403).json({ message: "You are not a member of this group" });
    }

    return next();
}

export const isGroupAdmin = async (req, res, next) => {
    const conversationId = req.params.id;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.groupAdmin || conversation.groupAdmin.toString() !== userId) {
        return res.status(403).json({ message: "You are not the admin of this group" });
    }

    return next();
}