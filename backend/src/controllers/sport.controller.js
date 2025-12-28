import Sport from "../models/sport.model.js";
import BaseController from "./base.controller.js";
import { getAllSports } from "../services/sport.services.js";

class SportController extends BaseController {
    constructor() {
        super(Sport);
    }

    getAll = async (req, res) => {
        try {
            const items = await getAllSports();
            this.success(res, items);
        } catch (err) {
            this.error(res, err);
        }
    };
}

export default new SportController();