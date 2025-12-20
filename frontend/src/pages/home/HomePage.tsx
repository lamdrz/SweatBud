import styles from './HomePage.module.css';
import EventsFilter from '../../components/events/EventsFilter';
import EventsList from '../../components/events/EventsList';

const HomePage: React.FC = () => {
    return (
        <div className={styles.homePage}>
            <div className={styles.filters}>
                <EventsFilter />
            </div>
            <div className={styles.events}>
                <EventsList />
            </div>
        </div>
    );
};

export default HomePage;
