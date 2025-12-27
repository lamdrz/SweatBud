import Event from "../models/event.model.js";

const populateEvent = (query) => {
    return query
        .populate({
            path: 'user',
            select: 'username birthdate profilePicture'
        })
        .populate({
            path: 'sport',
            select: 'name icon'
        })
        .populate({
            path: 'attendees.user',
            select: 'username profilePicture'
        });
};

// AI-ASSISTED
// Prompt : Retourne l'âge plutôt que birthdate
const formatEvent = (doc) => {
    const { user, ...rest } = doc;
    let age = null;
    if (user && user.birthdate) {
        const ageDifMs = Date.now() - new Date(user.birthdate).getTime();
        const ageDate = new Date(ageDifMs);
        age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    return {
        ...rest,
        user: user ? {
            _id: user._id,
            username: user.username,
            age: age,
            profilePicture: user.profilePicture
        } : null,
    };
};

export const getAllEvents = async () => {
    const query = Event.find().sort({ createdAt: -1 });
    const docs = await populateEvent(query).lean();
    return docs.map(doc => formatEvent(doc));
};

export const getEventById = async (id) => {
    const query = Event.findById(id);
    const doc = await populateEvent(query).lean();

    if (!doc) {
        const err = new Error('Event not found');
        err.status = 404;
        throw err;
    }

    return formatEvent(doc);
};

export const attendEvent = async (eventId, userId) => {
    const event = await Event.findById(eventId);
    if (!event) {
        const err = new Error('Event not found');
        err.status = 404;
        throw err;
    }
    if (event.attendees && event.max && event.attendees.length >= event.max) {
        const err = new Error('Event is full');
        err.status = 400;
        throw err;
    }
    
    const isAttending = event.attendees.some(
        att => att.user && att.user.toString() === userId
    );
    if (isAttending) {
        return { status: 208, message: "Already attending" };
    }

    event.attendees.push({ user: userId });
    await event.save();
    return { status: 200, message: "Joined event successfully" };
};

export const unattendEvent = async (eventId, userId) => {
    const event = await Event.findById(eventId);
    if (!event) {
        const err = new Error('Event not found');
        err.status = 404;
        throw err;
    }
    const initialLength = event.attendees.length;
    event.attendees = event.attendees.filter(
        att => att.user && att.user.toString() !== userId
    );
    if (event.attendees.length === initialLength) {
        const err = new Error('User is not attending the event');
        err.status = 400;
        throw err;
    }
    await event.save();
};

export const createEvent = async (eventData) => {
    const item = await Event.create(eventData);
    item.attendees.push({ user: item.user }); // Auto attend
    await item.save();
    return item;
};
