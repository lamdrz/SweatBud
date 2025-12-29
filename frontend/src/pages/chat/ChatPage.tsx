import React, { useState } from 'react';
import styles from './ChatPage.module.css';
import useAuth from '../../hooks/useAuth';
import ConversationsList from '../../components/chat/ConversationsList';
import ChatWindow from '../../components/chat/ChatWindow';
import type { Conversation } from '../../types/models';
import { useNavigate } from 'react-router-dom';

const ChatPage: React.FC = () => {
    const { auth } = useAuth();
    const currentUser = auth?.user;
    
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

    const navigate = useNavigate();
    if (!currentUser) {
        navigate('/login');
        return;
    }
    
    return (
        <div className={styles.chatPage}>
            {!selectedConversation ? (
                <ConversationsList 
                    setSelectedConversation={setSelectedConversation}
                    currentUser={currentUser}
                />
            ) : (
                <ChatWindow 
                    conversation={selectedConversation}
                    currentUser={currentUser}
                    setSelectedConversation={setSelectedConversation}
                />
            )}
        </div>
    );
};

export default ChatPage;
