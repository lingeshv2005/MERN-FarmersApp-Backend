import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema({
    messageId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    messageType: { type: String, enum: ["video", "text", "image", "document"], required: true },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
    reaction: { type: String, default: "" },
    seenBy: [{ type: String }], // Array of user IDs who have seen the message
    isEdited: { type: Boolean, default: false },
    isDeletedSoft: { type: Boolean, default: false },
    isDeletedHard: { type: Boolean, default: false },
}, { timestamps: true });

const groupChatSchema = new mongoose.Schema({
    communicationId: { type: String, required: true, unique: true },
    groupName: { type: String, required: true },
    adminIds: [{ type: String, required: true }], // User ID of the group admin
    participants: [{ type: String, required: true }], // Array of user IDs
    messages: [groupMessageSchema], // Array of messages in the group
}, { timestamps: true });

const GroupChat = mongoose.model("GroupChat", groupChatSchema);
export default GroupChat;

