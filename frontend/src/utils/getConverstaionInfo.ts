import type { Conversation } from "../types/models";

export const getConversationName = (conv: Conversation, currentUserId: string) => {
    if (conv.type === "group") return conv.title || "Groupe sans nom";
    // Private => name = username de l'autre
    const other = conv.members.find((m) => m._id !== currentUserId);
    return other?.username || "Utilisateur inconnu";
};

export const getConversationImage = (conv: Conversation, currentUserId: string) => {
    if (conv.type === "group") return "https://cdn-icons-png.flaticon.com/512/166/166258.png";
    // Private => image = profilePicture de l'autre
    const other = conv.members.find((m) => m._id !== currentUserId);
    return (
        other?.profilePicture ||
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    );
};

export const getOtherUserId = (conv: Conversation, currentUserId: string) => {
    if (conv.type === "group") return null;
    const other = conv.members.find((m) => m._id !== currentUserId);
    return other?._id || null;
};