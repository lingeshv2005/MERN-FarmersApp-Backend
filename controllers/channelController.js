import { v4 as uuidv4 } from "uuid";
import ChannelMessages from "../models/channelMessages.js";

// Create a new channel
export const createChannel = async (req, res) => {
    try {
        // Destructure necessary data from the request body
        const { channelName, adminId } = req.body;

        // Validate that all required fields are present
        if (!channelName || !adminId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Generate a new communicationId for the channel
        const communicationId = uuidv4();

        // Create a new channel document
        const newChannel = new ChannelMessages({
            communicationId,
            channelName,
            adminIds: [adminId],
            participants: [adminId],  // Admin is the only participant initially
            messages: [],  // Initially no messages in the channel
        });

        // Save the new channel in the database
        await newChannel.save();

        // Respond with a success message and the channel data
        res.status(201).json({ message: "Channel created successfully", channel: newChannel });
    } catch (error) {
        // Catch and respond to any server errors
        console.error("Error creating channel:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Fetch channels for a specific user (admin or participant)
export const getChannelsForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all channels where the user is an admin or a participant
        const channels = await ChannelMessages.find({
            $or: [
                { adminIds: userId },      // User is an admin
                { participants: userId }    // User is a participant
            ]
        });

        if (channels.length === 0) {
            return res.status(404).json({ message: "No channels found for this user" });
        }

        // Respond with the list of channels
        res.status(200).json({ channels });
    } catch (error) {
        console.error("Error fetching channels:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// ✅ JOIN AN EXISTING CHANNEL
export const joinChannel = async (req, res) => {
    try {
        const { communicationId } = req.params;
        const { userId } = req.body;

        const channel = await ChannelMessages.findOne({ communicationId });
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Check if the user is already a participant
        if (channel.participants.includes(userId)) {
            return res.status(400).json({ message: "User already joined the channel" });
        }

        // Add the user to the participants list
        channel.participants.push(userId);
        await channel.save();

        // Emit real-time update to all users in the channel
        io.emit("userJoinedChannel", { userId, communicationId });

        res.status(200).json({ message: "Joined the channel successfully", channel });
    } catch (error) {
        console.error("Error joining channel:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ SEND A MESSAGE TO A CHANNEL
export const sendMessageToChannel = async (req, res) => {
    try {
        const { communicationId, senderId, content, messageType } = req.body;

        if (!communicationId || !senderId || !content || !messageType) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const channel = await ChannelMessages.findOne({ communicationId });
        if (!channel) return res.status(404).json({ message: "Channel not found" });

        // Create a new message object
        const newMessage = {
            messageId: uuidv4(),
            senderId,
            content,
            messageType,
            status: "sent",
            seenBy: [],
        };

        // Add the new message to the channel's messages array
        channel.messages.push(newMessage);
        await channel.save();

        // Emit real-time message update to all participants in the channel
        io.emit("receiveChannelMessage", { ...newMessage, communicationId });

        res.status(201).json({ message: "Message sent", messageData: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ GET MESSAGES FOR A CHANNEL
export const getChannelMessages = async (req, res) => {
    try {
        const { communicationId } = req.params;

        const channel = await ChannelMessages.findOne({ communicationId });
        if (!channel) return res.status(404).json({ message: "Channel not found" });

        res.status(200).json({ messages: channel.messages });
    } catch (error) {
        console.error("Error getting channel messages:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ GET CHANNEL DETAILS BY COMMUNICATION ID
export const getChannelByCommunicationId = async (req, res) => {
    try {
        const { communicationId } = req.params;

        const channel = await ChannelMessages.findOne({ communicationId });
        if (!channel) return res.status(404).json({ message: "Channel not found" });

        res.status(200).json(channel);
    } catch (error) {
        console.error("Error getting channel:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ UPDATE MESSAGE STATUS (sent, delivered, read)
export const updateMessageStatus = async (req, res) => {
    try {
        const { communicationId, messageId, status } = req.body;

        const channel = await ChannelMessages.findOne({ communicationId });
        if (!channel) return res.status(404).json({ message: "Channel not found" });

        const message = channel.messages.find(msg => msg.messageId === messageId);
        if (!message) return res.status(404).json({ message: "Message not found" });

        if (["sent", "delivered", "read"].includes(status)) {
            message.status = status;
            await channel.save();
            res.status(200).json({ message: "Message status updated", message });
        } else {
            res.status(400).json({ message: "Invalid status" });
        }
    } catch (error) {
        console.error("Error updating message status:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
