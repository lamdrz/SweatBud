import { registerUser, authenticateUser, refreshAccessToken, logoutUser } from "../services/auth.services.js";

export const register = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await registerUser(req.body);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
        res.status(201).json({ message: "User registered successfully.", user: { id: user._id, username: user.username }, accessToken });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { user, accessToken, refreshToken } = await authenticateUser(req.body);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
        res.status(200).json({ message: "Login successful.", user: { id: user._id, username: user.username }, accessToken });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
    }
};

export const refresh = async (req, res) => {
    const { refreshToken } = req.cookies;
    try {
        const { accessToken, user } = await refreshAccessToken(refreshToken);
        res.status(200).json({ accessToken, user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    const { refreshToken } = req.cookies;
    try {
        await logoutUser(refreshToken);
        res.clearCookie('refreshToken');
        res.status(200).json({ message: "Logout successful." });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
    }
};