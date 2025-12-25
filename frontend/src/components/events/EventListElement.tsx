import styles from './EventListElement.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconName } from '@fortawesome/free-solid-svg-icons';
import type { Event } from '../../types/models';
import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';

interface EventData extends Omit<Event, 'user'> {
    user: {
        _id: string;
        username: string;
        age?: number;
        profilePicture?: string;
    };
}

const EventListElement = ({event}: {key: string, event: EventData}) => {
    const { auth } = useAuth();
    const user = auth?.user;

    const defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

    const { execute: joinEvent, loading: joinLoading } = useApi(`/events/${event._id}/attend`, {
        method: 'POST', 
        autoRun: false 
    });

    const eventDate = new Date(event.date);
    const today = new Date();
    const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
    
    let depart: string;
    const departTime = new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')
    
    if (eventDate.toDateString() === today.toDateString()) {
        depart = departTime;
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
        depart = `Demain - ${departTime}`;
    } else {
        const formattedDate = eventDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
        depart = `${formattedDate} - ${departTime}`;
    }

    const joinHandler = async () => {
        try {
            await joinEvent();
            alert("Inscription réussie !");
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message);
            }
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <div className={styles.topLeft}>
                    <div className={styles.userInfos}>
                        <img 
                            src={event.user.profilePicture || defaultAvatar} 
                            alt="avatar" 
                            className={styles.avatar} 
                        />
                        <div className={styles.userDetails}>
                            <span className={styles.username}>{event.user.username}</span>
                            <span className={styles.age}>{event.user.age ? `${event.user.age} ans` : ''}</span>
                        </div>
                    </div>
                    <div className={styles.eventInfos}>
                        <h3 className={styles.title}>{event.title}</h3>
                        <div className={styles.sport}>
                            <FontAwesomeIcon icon={event.sport.icon as IconName} />
                            <span className={styles.sportName}>{event.sport.name}</span>
                        </div>
                        { event.description && <p className={styles.description}>{event.description}</p> }
                    </div>
                </div>

                <div className={styles.medias}>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmRoCJ8x1m-Bl6aFakEGrEIzEE4yIblWGVow&s" alt={event.location} />
                </div>
            </div>

            <div className={styles.infoRow}>
                <div className={styles.timeContainer}>
                    <span className={styles.depart}>Départ</span>
                    <span className={styles.time}>{depart}</span>
                </div>
                <div className={styles.attendees}>
                    <FontAwesomeIcon icon="users" />
                    <span>{event.attendees ? event.attendees.length : 0}{event.max ? `/${event.max}` : ''}</span>
                </div>
            </div>

            { eventDate > today &&
            <div className={styles.actions}>
                <button className={`${styles.button} ${styles.contactBtn}`}>Contacter</button>
                { event.attendees && user && event.attendees.some(attendee => attendee.user._id === user.id) ?
                    <button className={`${styles.button} ${styles.contactBtn}`} disabled>Déjà rejoint</button>
                :
                    <button className={`${styles.button} ${styles.joinBtn}`} 
                        disabled={(event.attendees && event.max ? event.attendees.length >= event.max : false) || joinLoading}
                        onClick={joinHandler}
                    >{ joinLoading ? '...' : 'Rejoindre'}</button>
                }
            </div>
            }
        </div>
    );
};

export default EventListElement;
