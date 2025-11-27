import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};