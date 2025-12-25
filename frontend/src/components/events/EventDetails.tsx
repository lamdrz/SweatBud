import { useParams, useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import useAuth from "../../hooks/useAuth";
import type { Event } from "../../types/models";
import Loading from "../ui/Loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconName } from '@fortawesome/free-solid-svg-icons';
import styles from './EventDetails.module.css';

// Interface matching the backend response for this specific endpoint
interface EventData extends Omit<Event, 'user'> {
    user: {
        _id: string;
        username: string;
        age?: number;
        profilePicture?: string;
    };
}

const EventDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const currentUser = auth?.user;

    // Fetch event details
    const { data: event, loading, error, execute: refreshEvent } = useApi<EventData>(`/events/${id}`);

    // Join event action
    const { execute: joinEvent, loading: joinLoading } = useApi(`/events/${id}/attend`, {
        method: 'POST', 
        autoRun: false 
    });

    if (loading) return <Loading />;
    if (error) return <p>Erreur: {error.message}</p>;
    if (!event) return <p>Événement inexistant</p>;

    const eventDate = new Date(event.date);
    let formattedDate = eventDate.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric'
    });
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    const defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";
    const isCreator = currentUser?.id === event.user._id;
    const isAttending = event.attendees?.some(a => a.user._id === currentUser?.id);
    const isFull = event.max && event.attendees ? event.attendees.length >= event.max : false;
    const isPast = new Date() > eventDate;

    const handleJoin = async () => {
        try {
            await joinEvent();
            refreshEvent();
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message);
            }
        }
    };

    const handleContact = () => {
        navigate(`/chat/${event.user._id}`);
    };

    const handleProfile = (userId: string) => {
        navigate(`/profile/${userId}`);
    };

    return (<>
        <div className={styles.medias}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmRoCJ8x1m-Bl6aFakEGrEIzEE4yIblWGVow&s" alt={event.location} />
        </div>
        <div className={styles.container}>

            <div className={styles.header}>
                <div className={styles.userInfos} onClick={() => handleProfile(event.user._id)}>
                    <img 
                        src={event.user.profilePicture || defaultAvatar} 
                        alt={event.user.username} 
                        className={styles.avatar}
                    />
                    <div className={styles.userDetails}>
                        <span className={styles.username}>{event.user.username}</span>
                        {event.user.age && <span className={styles.age}>{event.user.age} ans</span>}
                    </div>
                </div>

                <h1 className={styles.title}>{event.title}</h1>

                <div className={styles.eventInfos}>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}><FontAwesomeIcon icon={event.sport.icon as IconName} /></span>
                        <span>{event.sport.name}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}><FontAwesomeIcon icon="calendar" /></span>
                        <span>{formattedDate}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}><FontAwesomeIcon icon="clock" /></span>
                        <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.icon}><FontAwesomeIcon icon="location-dot" /></span>
                        <span>{event.location}</span>
                    </div>
                </div>

                {event.description && <p className={styles.description}>{event.description}</p>}

                {!isCreator && !isPast && (
                    <div className={styles.actions}>
                        <button 
                            className={`${styles.button} ${styles.contactBtn}`}
                            onClick={handleContact}
                        >
                            Contacter
                        </button>
                        
                        {isAttending ? (
                            <button className={`${styles.button} ${styles.contactBtn}`} disabled>
                                Déjà inscrit
                            </button>
                        ) : (
                            <button 
                                className={`${styles.button} ${styles.joinBtn}`}
                                onClick={handleJoin}
                                disabled={isFull || joinLoading}
                            >
                                {joinLoading ? '...' : isFull ? 'Complet' : 'Rejoindre'}
                            </button>
                        )}
                    </div>
                )}
                {isPast && <p className={styles.pastMessage}>Cet événement est passé.</p>}
            </div>

            <div>
                <span className={styles.participants}>
                    <FontAwesomeIcon icon="users" />
                    Participants ({event.attendees?.length || 0}{event.max ? `/${event.max}` : ''})
                </span>
                
                {event.attendees && event.attendees.length > 0 ? (
                    <ul className={styles.attendeesList}>
                        {event.attendees.map((attendee) => (
                            <li key={attendee._id} className={styles.attendee} onClick={() => handleProfile(attendee.user._id)}>
                                <img 
                                    src={attendee.user.profilePicture || defaultAvatar} 
                                    alt={attendee.user.username} 
                                    className={styles.attendeeAvatar}
                                />
                                <span className={styles.attendeeName}>{attendee.user.username}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucun participant { !isPast ? 'pour le moment.' : ''}</p>
                )}
            </div>
        </div>
    </>);
};

export default EventDetails;
