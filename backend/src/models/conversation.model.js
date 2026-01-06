import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    type : { type: String, enum: ['private', 'group'], required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    title: { type: String },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
}, { timestamps: true });

conversationSchema.index({ members: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;