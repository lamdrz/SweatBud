import User from "../models/user.model.js";
import BaseController from "./base.controller.js";

class UserController extends BaseController {
    constructor() {
        super(User);
    }

    getProfile = async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("username email");
            if (!user) {
                const err = new Error("User not found");
                err.status = 404;
                throw err;
            }
            this.success(res, user);
        } catch (err) {
            this.error(res, err);
        }
    };
}

export default new UserController();