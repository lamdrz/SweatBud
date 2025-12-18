import Sport from "../models/sport.model.js";
import BaseController from "./base.controller.js";

class SportController extends BaseController {
    constructor() {
        super(Sport);
    }
}

export default new SportController();