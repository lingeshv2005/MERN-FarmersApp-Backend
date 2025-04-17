import { v4 as uuidv4 } from "uuid";
import GroupMessages from "../models/GroupMessages.js";
import IndividualMessage from "../models/Message.js";
import { io } from "../server.js"; // Import Socket.IO instance

// ✅ CREATE MESSAGE (Handles new chat creation)
export const createMessage = async (req, res) => {
    let { userId1, userId2, content, messageType, messagedUserId, communicationId } = req.body;


    // Check if all required fields are present
    if (!userId1 || !userId2 || !content || !messagedUserId ) {
        console.log(userId1,userId2,content,messagedUserId)
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        let chat;

        // ✅ If communicationId is null, generate a new one
        if (!communicationId) {
            communicationId = uuidv4(); // Generate a new communicationId
        }

        // ✅ Check if a chat already exists between the users using the communicationId or user IDs
        chat = await IndividualMessage.findOne({
            $or: [
                { communicationId },
                { $and: [{ userId1 }, { userId2 }] },
                { $and: [{ userId1: userId2 }, { userId2: userId1 }] }
            ]
        });

        // If chat doesn't exist, create a new chat
        if (!chat) {
            chat = new IndividualMessage({
                communicationId,
                userId1,
                userId2,
                messages: [],
            });

            await chat.save();
            console.log("New chat created:", chat);
        }

        // ✅ Create a new message
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

        // ✅ Push the new message to the existing chat
        chat.messages.push(newMessage);
        await chat.save();

        // ✅ Emit real-time message update to the connected clients
        io.emit("receiveMessage", { ...newMessage, communicationId });

        res.status(200).json({ message: "Message sent successfully", chat });
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// ✅ GET MESSAGES BY COMMUNICATION ID
export const getMessagesByCommunicationId = async (req, res) => {
    const { communicationId } = req.params;

    console.log(communicationId);
    if (!communicationId) {
        return res.status(400).json({ message: "Communication ID is required" });
    }

    try {
        const chat = await IndividualMessage.findOne({ communicationId });

        if (!chat) {
            return res.status(200).json({ messages: [] });
        }

        console.log(chat);
        res.status(200).json(chat);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ GET COMMUNICATION ID BY USER IDS (Creates a new chat if not found)
export const getOrCreateCommunicationId = async (req, res) => {
    const { userId1, userId2 } = req.params;

    if (!userId1 || !userId2) {
        return res.status(400).json({ message: "Both user IDs are required" });
    }

    try {
        let chat = await IndividualMessage.findOne({
            $or: [
                { userId1, userId2 },
                { userId1: userId2, userId2: userId1 }
            ]
        });

        if (!chat) {
            // If no chat exists, create a new one
            const communicationId = uuidv4();
            chat = new IndividualMessage({
                communicationId,
                userId1,
                userId2,
                messages: [],
            });
            console.log(chat);
            await chat.save();
        }

        res.status(200).json({ communicationId: chat.communicationId });
    } catch (error) {
        console.error("Error getting or creating communication ID:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// Create Group
export const createGroup = async (req, res) => {
    try {
        const { groupName, adminId, participants } = req.body;

        if (!groupName || !adminId || !participants || participants.length === 0) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const communicationId = uuidv4(); // Generate unique communication ID

        const newGroup = new GroupMessages({
            communicationId,
            groupName,
            adminIds: [adminId], // Set initial admin
            participants: [adminId, ...participants], // Include admin in participants
            messages: [],
        });

        await newGroup.save();
        res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add Member
export const addMemberToGroup = async (req, res) => {
    try {
        const { communicationId, userId } = req.body;

        const group = await GroupMessages.findOne({ communicationId });
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (group.participants.includes(userId)) {
            return res.status(400).json({ message: "User is already a participant" });
        }

        group.participants.push(userId);
        await group.save();

        res.status(200).json({ message: "User added successfully", group });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create Message
export const createGroupMessage = async (req, res) => {
    try {
        const { communicationId, senderId, content, messageType } = req.body;

        const group = await GroupMessages.findOne({ communicationId });
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const newMessage = {
            messageId: uuidv4(),
            senderId,
            content,
            messageType,
            status: "sent",
            seenBy: [],
        };

        group.messages.push(newMessage);
        await group.save();

        res.status(201).json({ message: "Message sent", messageData: newMessage });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Messages by Communication ID
export const getGroupMessagesByCommunicationId = async (req, res) => {
    try {
        const { communicationId } = req.params;

        const group = await GroupMessages.findOne({ communicationId });
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json({ messages: group.messages });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getGroupByCommunicationId = async (req, res) => {
    try {
        const { communicationId } = req.params;
        const group = await GroupMessages.findOne({ communicationId });

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}














// ✅ GET MESSAGES IF COMMUNICATION EXISTS
export const getMessagesIfCommunicationExists = async (req, res) => {
    const { userId1, userId2 } = req.params;

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
            // Communication doesn't exist
            return res.status(200).json({ communicationId: null, messages: [] });
        }

        return res.status(200).json({ communicationId: chat.communicationId, messages: chat.messages });
    } catch (error) {
        console.error("Error getting messages:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
