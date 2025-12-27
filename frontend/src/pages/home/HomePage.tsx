import styles from './HomePage.module.css';
import EventsFilter from '../../components/events/EventsFilter';
import EventsList from '../../components/events/EventsList';
import { useState } from 'react';

export interface EventFilters {
    [key: string]: any;
}

const HomePage: React.FC = () => {
    const [filters, setFilters] = useState<EventFilters>({}); 

    return (
        <div className={styles.homePage}>
            <div className={styles.filters}>
                <EventsFilter setFilters={setFilters} />
            </div>
            <div className={styles.events}>
                <EventsList filters={filters} />
            </div>
        </div>
    );
};

export default HomePage;
