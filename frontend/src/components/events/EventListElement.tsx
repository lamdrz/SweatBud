import type { Event } from '../../types/models';


const EventListElement = ({event}: {key: string, event: Event}) => {

    return (
        <div>
            <h3>{event.title}</h3>
            <p>Sport: {event.sport.name}</p>
            <p>Location: {event.location}</p>
            <p>Date: {new Date(event.date).toLocaleString()}</p>
            <p>Max Attendees: {event.max}</p>
            <p>User: {event.user.username}</p>
        </div>
    );
};

export default EventListElement;
