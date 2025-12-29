import User from "../models/user.model.js";

export const authorize = (role) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const user = await User.findById(req.user.id);

            if (!user || user.role !== role) {
                return res.status(403).json({ message: "Access denied" });
            }

            return next();
        } catch (error) {
            console.error("Authorization error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
};
