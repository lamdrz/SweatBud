import { useEffect } from 'react';
import EventListElement from './EventListElement';
import styles from './EventsList.module.css';
import useApi from '../../hooks/useApi';
import type { Event } from '../../types/models';
import Loading from '../ui/Loading';

const EventsList = () => {
    const { data: events, loading, error, execute } = useApi<Event[]>('/events', { autoRun: false });

    useEffect(() => {
        execute();
    }, []);

    if (loading) return <Loading />;
    if (error) return <p>Erreur: {error.message}</p>;

    return (
        <div className={styles.eventsList}>
            { events && events.map(event => (
                <EventListElement key={event._id} event={event} />
            ))}
        </div>
    );
};

export default EventsList;
