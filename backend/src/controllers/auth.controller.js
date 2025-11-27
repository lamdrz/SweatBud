import { registerUser, authenticateUser } from "../services/auth.services.js";

export const register = async (req, res) => {
    try {
        const { user, token } = await registerUser(req.body);
        res.status(201).json({ message: "User registered successfully.", user: { id: user._id, username: user.username }, token });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { user, token } = await authenticateUser(req.body);
        res.status(200).json({ message: "Login successful.", user: { id: user._id, username: user.username }, token });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
    }
};