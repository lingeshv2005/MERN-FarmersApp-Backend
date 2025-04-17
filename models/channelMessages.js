import mongoose from "mongoose";

// Define schema for channel messages
const channelMessageSchema = new mongoose.Schema({
    messageId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    messageType: { type: String, enum: ["video", "text", "image", "document"], required: true },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
    seenBy: [{ type: String }],
    isEdited: { type: Boolean, default: false },
    isDeletedSoft: { type: Boolean, default: false },
    isDeletedHard: { type: Boolean, default: false },
}, { timestamps: true });

// Define schema for channels
const channelSchema = new mongoose.Schema({
    communicationId: { type: String, required: true, unique: true },
    channelName: { type: String, required: true },
    adminIds: [{ type: String, required: true }],
    participants: [{ type: String, required: true }],
    messages: [channelMessageSchema],
}, { timestamps: true });

// Create ChannelMessages model
const ChannelMessages = mongoose.model("ChannelMessages", channelSchema);

export default ChannelMessages;
