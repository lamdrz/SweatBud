import Event from "../models/event.model.js";
import BaseController from "./base.controller.js";

class EventController extends BaseController {
    constructor() {
        super(Event);
    }

    _populateEvent(query) {
        return query
            .populate({
                path: 'user',
                select: 'username birthdate'
            })
            .populate({
                path: 'sport',
                select: 'name icon'
            })
            .populate({
                path: 'attendees.user',
                select: 'username'
            });
    }

    // AI-ASSISTED
    // Prompt : Retourne l'âge plutôt que birthdate
    _formatEvent(doc) {
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
                age: age
            } : null,
        };
    }

    getAll = async (req, res) => {
        try {
            const query = this.model.find().sort({ createdAt: -1 });
            const docs = await this._populateEvent(query).lean();

            const results = docs.map(doc => this._formatEvent(doc));

            res.status(200).json(results);
        } catch (err) {
            this.error(res, err);
        }
    }

    getById = async (req, res) => {
        try {
            const query = this.model.findById(req.params.id);
            const doc = await this._populateEvent(query).lean();

            if (!doc) {
                return res.status(404).json({ message: 'Event not found' });
            }

            const result = this._formatEvent(doc);

            res.status(200).json(result);
        } catch (err) {
            this.error(res, err);
        }
    }

    attend = async (req, res) => {
        try {
            const eventId = req.params.id;
            const userId = req.user.id;
            const event = await this.model.findById(eventId);
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            if (event.attendees && event.max && event.attendees.length >= event.max) {
                return res.status(400).json({ message: 'Event is full' });
            }
            
            const isAttending = event.attendees.some(
                att => att.user && att.user.toString() === userId
            );

            if (isAttending) {
                return res.status(400).json({ message: 'User already attending the event' });
            }
            
            event.attendees.push({ user: userId });
            await event.save();
            res.status(200).json({ message: 'User added to event attendees' });
        } catch (err) {
            this.error(res, err);
        }
    }
}

export default new EventController();