import Event from "../models/event.model.js";
import BaseController from "./base.controller.js";

class EventController extends BaseController {
    constructor() {
        super(Event);
    }
}

export default new EventController();