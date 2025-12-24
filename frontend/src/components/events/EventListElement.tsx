import styles from './EventListElement.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconName } from '@fortawesome/free-solid-svg-icons';
import type { Event } from '../../types/models';

interface EventData extends Omit<Event, 'user'> {
    user: {
        _id: string;
        username: string;
        age?: number;
        profilePicture?: string;
    };
}

const EventListElement = ({event}: {key: string, event: EventData}) => {
    const defaultAvatar = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

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
                    <span className={styles.time}>{
                        new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')
                    }</span>
                </div>
                <div className={styles.attendees}>
                    <FontAwesomeIcon icon="users" />
                    <span>{event.attendees ? event.attendees.length : 0}{event.max ? `/${event.max}` : ''}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={`${styles.button} ${styles.contactBtn}`}>Contacter</button>
                <button className={`${styles.button} ${styles.joinBtn}`}>Rejoindre</button>
            </div>
        </div>
    );
};

export default EventListElement;
