import Sport from "../models/sport.model.js";

export const getAllSports = async () => {
    return Sport.find().sort({ name: 1 }).lean();
};
