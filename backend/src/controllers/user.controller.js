import User from "../models/user.model.js";
import BaseController from "./base.controller.js";
import { getUserProfile, getOwnUserProfile, updateUserField } from "../services/user.services.js";

class UserController extends BaseController {
    constructor() {
        super(User);
    }

    getProfile = async (req, res) => {
        try {
            const user = await getUserProfile(req.params.id);
            this.success(res, user);
        } catch (err) {
            this.error(res, err);
        }
    };

    getOwnProfile = async (req, res) => {
        try {
            const user = await getOwnUserProfile(req.user.id);
            this.success(res, user);
        } catch (err) {
            this.error(res, err);
        }
    };

    updateField = async (req, res) => {
        try {
            const { field, value } = req.body;
            await updateUserField(req.user.id, field, value);
            this.success(res, null, 204);
        } catch (err) {
            this.error(res, err);
        }
    };
}

export default new UserController();