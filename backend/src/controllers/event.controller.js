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
                age: age,
                profilePicture: user.profilePicture
            } : null,
        };
    }

    getAll = async (req, res) => {
        try {
            const query = this.model.find().sort({ createdAt: -1 });
            const docs = await this._populateEvent(query).lean();

            const results = docs.map(doc => this._formatEvent(doc));

            this.success(res, results);
        } catch (err) {
            this.error(res, err);
        }
    }

    getById = async (req, res) => {
        try {
            const query = this.model.findById(req.params.id);
            const doc = await this._populateEvent(query).lean();

            if (!doc) {
                const err = new Error('Event not found');
                err.status = 404;
                throw err;
            }

            const result = this._formatEvent(doc);

            this.success(res, result);
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
                this.success(res, null, 208);
                return;
            }
            
            event.attendees.push({ user: userId });
            await event.save();
            this.success(res, null, 204);
        } catch (err) {
            this.error(res, err);
        }
    }

    unattend = async (req, res) => {
        try {
            const eventId = req.params.id;
            const userId = req.user.id;
            const event = await this.model.findById(eventId);
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
            this.success(res, null, 204);
        } catch (err) {
            this.error(res, err);
        }
    }

    create = async (req, res) => {
        try {
            const item = await this.model.create(req.body);
            item.attendees.push({ user: item.user }); // Auto attend
            await item.save();
            this.success(res, item, 201);
        } catch (err) {
            this.error(res, err);
        }
    }
}

export default new EventController();