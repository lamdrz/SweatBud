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
    attendees: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        joinedAt: { type: Date, default: Date.now }
    }],
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
}, { timestamps: true });

eventSchema.index({ user: 1 });
eventSchema.index({ sport: 1 });
eventSchema.index({ location: 'text', date: 1 });
eventSchema.index({ 'attendees.user': 1 });
 
const Event = mongoose.model("Event", eventSchema);
export default Event;