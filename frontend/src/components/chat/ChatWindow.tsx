import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatWindow.module.css';
import useApi from '../../hooks/useApi';
import Loading from '../ui/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Conversation, Message } from '../../types/models';
import type { User as AuthUser } from '../../types/auth';
import { getConversationImage, getConversationName, getOtherUserId } from '../../utils/getConverstaionInfo';
import { useNavigate } from 'react-router-dom';

interface ChatWindowProps {
    conversation: Conversation;
    currentUser: AuthUser;
    setSelectedConversation: (conversation: Conversation | null) => void;
}

const formatMessageDate = (createdAt: string | Date) => {
    const date = new Date(createdAt);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    
    return isToday 
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleString([], { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, setSelectedConversation }) => {
    const { data: messages, loading: loadingMessages, execute: refreshMessages } = useApi<Message[]>(`/chats/${conversation._id}/messages`, { 
        autoRun: true 
    });
    const { execute: sendMessage, loading: sending } = useApi(`/chats/${conversation._id}/messages`, { 
        method: 'POST', 
        autoRun: false 
    });

    const [newMessage, setNewMessage] = useState('');

    const navigate = useNavigate();

    // AI-ASSISTED : Scroll to bottom quand on reçoit des messages
    const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        try {
            await sendMessage({ 
                text: newMessage,
                sender: currentUser.id,
                conversation: conversation._id
            });
            setNewMessage('');
            refreshMessages();
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const handleAvatarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const otherUserId = getOtherUserId(conversation, currentUser.id);
        if (otherUserId) {
            navigate(`/profile/${otherUserId}`);
        }
    }

    let previousUserId: string | null = null;
    const getMinuteTime = (date: string | Date) => new Date(date).setSeconds(0, 0);

    return (
        <div className={styles.chatView}>
            <div className={styles.chatHeader}>
                <button className={styles.backButton} onClick={() => setSelectedConversation(null)}>
                    <FontAwesomeIcon icon="arrow-left" />
                </button>
                <div className={styles.headerInfo} onClick={handleAvatarClick}>
                    <img src={getConversationImage(conversation, currentUser.id)} alt="avatar" className={styles.avatar}  />
                    <span className={styles.headerName}>{getConversationName(conversation, currentUser.id)}</span>
                </div>
            </div>

            <div className={styles.messagesList}>
                {loadingMessages ? <Loading /> : messages?.map((msg, index, allMessages) => {
                    const isMe = msg.sender._id === currentUser?.id;
                    const showSenderName = previousUserId !== msg.sender._id;
                    
                    const nextMsg = allMessages[index + 1];
                    const nextDate = nextMsg ? getMinuteTime(nextMsg.createdAt) : null;
                    const showDate = nextDate !== getMinuteTime(msg.createdAt);

                    previousUserId = msg.sender._id;

                    return (<div key={msg._id} 
                        className={`${styles.messageItem} ${isMe ? styles.myMessage : styles.theirMessage}`}
                        style={{ marginTop: !showSenderName ? '-0.5rem' : '0' }}
                    >
                        {showSenderName && <span className={styles.senderName} onClick={() => navigate(`/profile/${msg.sender._id}`)}>{msg.sender.username}</span>}
                        <div className={styles.messageBubble} >
                            {msg.text}
                        </div>
                        {showDate && <span className={styles.date}>{formatMessageDate(msg.createdAt)}</span>}
                    </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={handleSendMessage}>
                <input type="file" name="file" id="file" style={{display: 'none'}} />
                <label htmlFor="file" className={styles.sendButton}><FontAwesomeIcon icon="plus" /></label>
                <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="Votre message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className={styles.sendButton} disabled={sending || !newMessage.trim()}>
                    <FontAwesomeIcon icon="paper-plane" />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
