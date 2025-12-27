import { registerUser, authenticateUser, refreshAccessToken, logoutUser, changePassword } from "../services/auth.services.js";
import BaseController from "./base.controller.js";

class AuthController extends BaseController {
    register = async (req, res) => {
        try {
            const { user, accessToken, refreshToken } = await registerUser(req.body);
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
            this.success(res, { message: "User registered successfully.", user: { id: user._id, username: user.username }, accessToken }, 201);
        } catch (err) {
            this.error(res, err);
        }
    };

    login = async (req, res) => {
        try {
            const { user, accessToken, refreshToken } = await authenticateUser(req.body);
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
            this.success(res, { message: "Login successful.", user: { id: user._id, username: user.username }, accessToken });
        } catch (err) {
            this.error(res, err);
        }
    };

    refresh = async (req, res) => {
        const { refreshToken } = req.cookies;
        try {
            const { accessToken, user } = await refreshAccessToken(refreshToken);
            this.success(res, { accessToken, user: { id: user._id, username: user.username } });
        } catch (err) {
            this.error(res, err);
        }
    };

    logout = async (req, res) => {
        const { refreshToken } = req.cookies;
        try {
            await logoutUser(refreshToken);
            res.clearCookie('refreshToken');
            this.success(res, { message: "Logout successful." });
        } catch (err) {
            this.error(res, err);
        }
    };

    changePassword = async (req, res) => {
        if (!req.user || !req.user.id) {
            return this.error(res, { message: "Unauthorized" }, 401);
        }
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        try {
            await changePassword(userId, oldPassword, newPassword);
            this.success(res, { message: "Password changed successfully." });
        } catch (err) {
            this.error(res, err);
        }
    };
}

export default new AuthController();