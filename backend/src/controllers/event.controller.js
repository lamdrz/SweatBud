import Event from "../models/event.model.js";
import BaseController from "./base.controller.js";

class EventController extends BaseController {
    constructor() {
        super(Event);
    }

    // AI-ASSISTED
    // Prompt : Retourne l'âge plutôt que birthdate
    getAll = async (req, res) => {
        try {
            const docs = await this.model.find()
                .populate({
                    path: 'user',
                    select: 'username birthdate'
                })
                .populate({
                    path: 'sport',
                    select: 'name icon'
                })
                .lean();

            const results = docs.map(doc => {
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
                    } : null
                };
            });

            res.status(200).json(results);
        } catch (err) {
            this.error(res, err);
        }
    }
}

export default new EventController();