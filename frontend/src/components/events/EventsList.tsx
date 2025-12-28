import { useEffect } from 'react';
import EventListElement from './EventListElement';
import styles from './EventsList.module.css';
import useApi from '../../hooks/useApi';
import type { Event } from '../../types/models';
import Loading from '../ui/Loading';
import type { EventFilters } from '../../pages/home/HomePage';

const EventsList = ({ filters }: { filters: EventFilters }) => {
    // AI-ASSISTED : Construction de la query string
    const queryString = new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {} as Record<string, string>)
    ).toString();

    const { data: events, loading, error, execute } = useApi<Event[]>(`/events?${queryString}`, { autoRun: false });

    useEffect(() => {
        execute();
    // eslint-disable-next-line
    }, [filters]);

    if (loading) return <Loading />;
    if (error) return <p>Erreur: {error.message}</p>;

    if (!events || events.length === 0) {
        return <p className={styles.noEvents}>Aucun événement trouvé.</p>;
    }

    return (
        <div className={styles.eventsList}>
            { events.map(event => (
                <EventListElement key={event._id} event={event} />
            ))}
        </div>
    );
};

export default EventsList;
