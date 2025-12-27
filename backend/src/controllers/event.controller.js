import Event from "../models/event.model.js";
import BaseController from "./base.controller.js";
import { getAllEvents, getEventById, attendEvent, unattendEvent, createEvent } from "../services/event.services.js";

class EventController extends BaseController {
    constructor() {
        super(Event);
    }



    getAll = async (req, res) => {
        try {
            const results = await getAllEvents(req.query);
            this.success(res, results);
        } catch (err) {
            this.error(res, err);
        }
    }

    getById = async (req, res) => {
        try {
            const result = await getEventById(req.params.id);
            this.success(res, result);
        } catch (err) {
            this.error(res, err);
        }
    }

    attend = async (req, res) => {
        try {
            const result = await attendEvent(req.params.id, req.user.id);
            if (result.status === 208) {
                this.success(res, null, 208);
            } else {
                this.success(res, null, 204);
            }
        } catch (err) {
            this.error(res, err);
        }
    }

    unattend = async (req, res) => {
        try {
            await unattendEvent(req.params.id, req.user.id);
            this.success(res, null, 204);
        } catch (err) {
            this.error(res, err);
        }
    }

    create = async (req, res) => {
        try {
            const item = await createEvent(req.body);
            this.success(res, item, 201);
        } catch (err) {
            this.error(res, err);
        }
    }
}

export default new EventController();