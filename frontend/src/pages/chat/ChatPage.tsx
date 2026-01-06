import styles from './ChatPage.module.css';
import useAuth from '../../hooks/useAuth';
import ConversationsList from '../../components/chat/ConversationsList';
import ChatWindow from '../../components/chat/ChatWindow';
import type { Conversation } from '../../types/models';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import Loading from '../../components/ui/Loading';
import { useEffect } from 'react';

const ChatPage: React.FC = () => {
    const { auth } = useAuth();
    const currentUser = auth?.user;
    
    const navigate = useNavigate();
    if (!currentUser) {
        navigate('/login');
        return;
    }

    const { conversationId } = useParams<{ conversationId: string }>();
    const {data: conversation, loading, error, execute: refreshConversation} = useApi<Conversation>(`/chats/${conversationId}`, { autoRun: false });

    useEffect(() => {
        if (conversationId) {
            refreshConversation();
        }
    // eslint-disable-next-line
    }, [conversationId]);

    if (conversationId) {

        if (loading) return <Loading />;
        if (error) return <p>Erreur : {error.message}</p>
        if (!conversation) return <p>Conversation introuvable.</p>

        return (
            <div className={styles.chatPage}>
                <ChatWindow 
                    conversation={conversation}
                    currentUser={currentUser}
                />
            </div>
        );
    } else {
        return (
            <div className={styles.chatPage}>
                <ConversationsList
                    currentUser={currentUser}
                />
            </div>
        );
    }
};

export default ChatPage;
