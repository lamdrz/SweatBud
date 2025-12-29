import styles from "./ConversationListElement.module.css";
import type { Conversation } from "../../types/models";
import type { User as AuthUser } from "../../types/auth";
import { getConversationImage, getConversationName, getOtherUserId } from "../../utils/getConverstaionInfo";
import { useNavigate } from "react-router-dom";

const ConversationListElement: React.FC<{ conv: Conversation; currentUser: AuthUser }> = ({ conv, currentUser }) => {
    const navigate = useNavigate();

    const isUnread = (conv: Conversation) => {
        if (!conv.lastMessage) return false;
        return !conv.lastMessage.readBy.some(user => user._id === currentUser?.id) && conv.lastMessage.sender._id !== currentUser?.id;
    }

    const formatDisplayDate = (dateInput: string | Date | number) => {
        const date = new Date(dateInput);
        const now = new Date();

        if (date.toDateString() === now.toDateString()) {
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 1) return "À l'instant";
            if (diffMins < 60) return `Il y a ${diffMins} min`;
            const diffHours = Math.floor(diffMins / 60);
            return `Il y a ${diffHours} h`;
        }

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return "Hier";
        }

        return date.toLocaleDateString();
    };

    const handleAvatarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const otherUserId = getOtherUserId(conv, currentUser.id);
        if (otherUserId) {
            navigate(`/profile/${otherUserId}`);
        }
    }
    
    return <>
        <img src={getConversationImage(conv, currentUser.id)} alt="avatar" className={styles.avatar} onClick={handleAvatarClick}/>
        <div className={styles.conversationInfo}>
            <div className={styles.topRow}>
                <span className={styles.name}>{getConversationName(conv, currentUser.id)}</span>
                {conv.lastMessage && (
                    <span className={styles.date + (isUnread(conv) ? ` ${styles.unreadDate}` : '')}>
                        {formatDisplayDate(conv.updatedAt)}
                    </span>
                )}
            </div>
            <div className={styles.bottomRow}>
                <span className={styles.lastMessage}>
                    {conv.lastMessage ? (
                        <>
                            {conv.lastMessage.sender._id === currentUser?.id && "Vous: "}
                            {conv.lastMessage.text}
                        </>
                    ) : (
                        <em>Nouvelle conversation</em>
                    )}
                </span>
                { isUnread(conv) && (
                    <span className={styles.unreadIndicator}></span>
                )}
            </div>
        </div>
    </>;
}

export default ConversationListElement;