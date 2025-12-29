import React, { useEffect } from 'react';
import styles from './ConversationsList.module.css';
import useApi from '../../hooks/useApi';
import Loading from '../ui/Loading';
import type { Conversation } from '../../types/models';
import type { User as AuthUser } from '../../types/auth';
import ConversationListElement from './ConversationListElement';

interface ConversationsListProps {
    currentUser: AuthUser;
    setSelectedConversation: (conversation: Conversation) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({ currentUser, setSelectedConversation }) => {
    const [activeTab, setActiveTab] = React.useState<'private' | 'group'>('private');

    const { data: conversations, loading, error, execute: refresh } = useApi<Conversation[]>(`/chats?type=${activeTab}`, { autoRun: false});

    useEffect(() => {
        refresh();
    // eslint-disable-next-line
    }, [activeTab]);

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <div 
                    className={`${styles.tab} ${activeTab === 'private' ? styles.activeTab : ''}`}
                    onClick={() => { setActiveTab('private'); }}
                >
                    Messages
                </div>
                <div 
                    className={`${styles.tab} ${activeTab === 'group' ? styles.activeTab : ''}`}
                    onClick={() => { setActiveTab('group'); }}
                >
                    Groupes
                </div>
            </div>

            <div className={styles.conversationList}>
                {loading && <Loading />}
                {error && <p className={styles.emptyState}>Erreur de chargement</p>}
                
                {!loading && (!conversations || conversations.length === 0) && (
                    <p className={styles.emptyState}>Aucune conversation</p>
                )}

                {conversations?.map(conv => (
                    <div key={conv._id} className={styles.conversationItem} onClick={() => setSelectedConversation(conv)}>
                        <ConversationListElement 
                            conv={conv} 
                            currentUser={currentUser} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConversationsList;
