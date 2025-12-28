import Event from "../models/event.model.js";
import User from "../models/user.model.js";

const populateEvent = (query) => {
    return query
        .populate({
            path: 'user',
            select: 'username birthdate profilePicture gender'
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
            gender: user.gender,
            profilePicture: user.profilePicture
        } : null,
    };
};

// AI-ASSISTED : Aide pour les filtres mongoose
// Prompt : Modifie la fonction getAllEvents pour qu'elle prenne en compte les filtres envoyés depuis le front
// Modification : Incohérence logique sur certains filtres
export const getAllEvents = async (filters = {}) => {
    const query = {};
    const creatorFilterSpecified = !!filters.creator;

    if (filters.sport) {
        query.sport = filters.sport;
    }
    if (filters.city) {
        query.location = { $regex: filters.city, $options: 'i' };
    }
    if (filters.attendee) {
        query['attendees.user'] = filters.attendee;
        if (!creatorFilterSpecified) {
            query.user = { $ne: filters.attendee };
        }
    }

    // Date
    const now = new Date();
    if (filters.date) {
        const start = new Date(filters.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(filters.date);
        end.setHours(23, 59, 59, 999);
        query.date = { $gte: start, $lte: end };
    } else if (filters.passed === 'false') {
        query.date = { $gte: now };
    }
    // passed = true => return all events by default

    // Full
    if (filters.full === 'false') {
        // return only available events
        query.$or = [
            { max: { $exists: false } },
            { max: null },
            { $expr: { $lt: [{ $size: { $ifNull: ["$attendees", []] } }, "$max"] } }
        ];
    }

    // Apply user attribute filters at DB level (gender, age, creator)
    const userCriteria = {};
    if (filters.gender) {
        // case-insensitive exact match
        userCriteria.gender = new RegExp(`^${filters.gender}$`, 'i');
    }
    if (filters.ageMin || filters.ageMax) {
        const minAge = filters.ageMin ? parseInt(filters.ageMin, 10) : 18;
        const maxAge = filters.ageMax ? parseInt(filters.ageMax, 10) : 99;
        const now = new Date();
        const maxBirthdate = new Date(now);
        maxBirthdate.setFullYear(now.getFullYear() - minAge);
        const minBirthdate = new Date(now);
        minBirthdate.setFullYear(now.getFullYear() - maxAge);
        userCriteria.birthdate = { $gte: minBirthdate, $lte: maxBirthdate };
    }
    if (creatorFilterSpecified) {
        userCriteria._id = filters.creator;
    }

    if (Object.keys(userCriteria).length > 0) {
        const users = await User.find(userCriteria).select('_id').lean();
        const userIds = users.map(u => u._id);
        if (userIds.length === 0) return []; // No users match criteria

        const excludeUser = query.user && query.user.$ne ? query.user.$ne : null;
        query.user = excludeUser ? { $in: userIds, $ne: excludeUser } : { $in: userIds };
    }

    const mongooseQuery = Event.find(query).sort({ createdAt: -1 });
    const docs = await populateEvent(mongooseQuery).lean();
    const formattedEvents = docs.map(doc => formatEvent(doc));

    return formattedEvents;
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
