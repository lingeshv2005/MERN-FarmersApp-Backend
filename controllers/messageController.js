import { v4 as uuidv4 } from "uuid";
import IndividualMessage from "../models/Message.js";
import { io } from "../server.js"; // Import Socket.IO instance

// ✅ CREATE MESSAGE (Fixed communicationId issue)
export const createMessage = async (req, res) => {
    console.log("Received message request:", req.body); // Debugging

    let { userId1, userId2, content, messageType, messagedUserId, communicationId } = req.body;

    if (!userId1 || !userId2 || !content || !messagedUserId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        let chat;

        // ✅ First, check if a chat already exists between the users
        chat = await IndividualMessage.findOne({
            $or: [
                { userId1, userId2 },
                { userId1: userId2, userId2: userId1 }
            ]
        });

        // ✅ If chat exists, use its communicationId
        if (chat) {
            communicationId = chat.communicationId;
        } else {
            // ✅ If no chat exists, create a new one
            if (!communicationId) {
                communicationId = uuidv4();
            }

            chat = new IndividualMessage({
                communicationId,
                userId1,
                userId2,
                messages: [],
            });
        }

        // ✅ Create new message
        const newMessage = {
            messageId: uuidv4(),
            messagedUserId,
            content,
            messageType,
            status: "sent",
            seenAt: null,
            isEdited: false,
            isDeletedSoft: false,
            isDeletedHard: false,
        };

        // ✅ Push message to chat
        chat.messages.push(newMessage);
        await chat.save();

        // ✅ Emit real-time message update
        io.emit("receiveMessage", { ...newMessage, communicationId });

        res.status(200).json({ message: "Message sent successfully", chat });
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ GET MESSAGES BY USER IDS
export const getMessages = async (req, res) => {
    const { userId1, userId2 } = req.query;

    if (!userId1 || !userId2) {
        return res.status(400).json({ message: "Both user IDs are required" });
    }

    try {
        const chat = await IndividualMessage.findOne({
            $or: [
                { userId1, userId2 },
                { userId1: userId2, userId2: userId1 }
            ]
        });
        
        if (!chat) {
            return res.status(200).json({ messages: [] });
        }

        res.status(200).json({ messages: chat.messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ GET MESSAGES BY COMMUNICATION ID
export const getMessagesByCommunicationId = async (req, res) => {
    const { communicationId } = req.params;

    if (!communicationId) {
        return res.status(400).json({ message: "Communication ID is required" });
    }

    try {
        const chat = await IndividualMessage.findOne({ communicationId });

        if (!chat) {
            return res.status(200).json({ messages: [] });
        }

        res.status(200).json({ messages: chat.messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
