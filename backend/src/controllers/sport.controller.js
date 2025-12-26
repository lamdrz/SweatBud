import Sport from "../models/sport.model.js";
import BaseController from "./base.controller.js";

class SportController extends BaseController {
    constructor() {
        super(Sport);
    }

    getAll = async (req, res) => {
        try {
            const items = await this.model.find().sort({ name: 1 });
            this.success(res, items);
        } catch (err) {
            this.error(res, err);
        }
    };
}

export default new SportController();