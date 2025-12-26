import User from "../models/user.model.js";
import BaseController from "./base.controller.js";

class UserController extends BaseController {
    constructor() {
        super(User);
    }

    getProfile = async (req, res) => {
        try {
            const query = this.model.findById(req.params.id).select("username city sports bio birthdate profilePicture")
            const doc = await query.populate({
                    path: "sports", 
                    select: "name icon"
                }).lean();

            if (!doc) {
                const err = new Error("User not found");
                err.status = 404;
                throw err;
            }

            let age = null;
            if (doc && doc.birthdate) {
                const ageDifMs = Date.now() - new Date(doc.birthdate).getTime();
                const ageDate = new Date(ageDifMs);
                age = Math.abs(ageDate.getUTCFullYear() - 1970);
            }

            const user = {
                _id: doc._id,
                username: doc.username,
                city: doc.city,
                sports: doc.sports || [],
                bio: doc.bio,
                age: age,
                profilePicture: doc.profilePicture
            };

            this.success(res, user);
        } catch (err) {
            this.error(res, err);
        }
    };
}

export default new UserController();