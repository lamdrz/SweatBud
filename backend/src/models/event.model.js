import mongoose from "mongoose";
 
const eventSchema = new mongoose.Schema({
    user : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    max: { type: Number },
    medias: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});
 
const Event = mongoose.model("Event", eventSchema);
export default Event;