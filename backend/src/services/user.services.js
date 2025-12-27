import User from "../models/user.model.js";

export const getUserProfile = async (id) => {
    const query = User.findById(id).select("username city sports bio birthdate profilePicture");
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

    return {
        _id: doc._id,
        username: doc.username,
        city: doc.city,
        sports: doc.sports || [],
        bio: doc.bio,
        age: age,
        profilePicture: doc.profilePicture
    };
};

export const getOwnUserProfile = async (id) => {
    const user = await User.findById(id)
        .select("-password -role -refreshToken -createdAt")
        .populate({
            path: "sports",
            select: "name icon"
        }).lean();

    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }

    return user;
};

export const updateUserField = async (userId, field, value) => {
    if (!field || value === undefined) {
        const err = new Error("Field and value are required");
        err.status = 400;
        throw err;
    }

    if (field === 'password') {
        const err = new Error("Use the dedicated change password endpoint");
        err.status = 400;
        throw err;
    }

    const allowedFields = ["username", "email", "firstName", "lastName", "city", "bio", "birthdate", "gender", "profilePicture", "sports"];
    if (!allowedFields.includes(field)) {
        const err = new Error("Invalid field");
        err.status = 400;
        throw err;
    }

    const update = {};
    update[field] = value;

    await User.findByIdAndUpdate(
        userId,
        { $set: update },
        { new: true }
    );
};
