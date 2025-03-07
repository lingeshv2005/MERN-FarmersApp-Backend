// import IndividualMessage from '../models/Message.js';
// import { v4 as uuidv4 } from 'uuid';

// export const createMessage =async (req,res)=>{
//     const {userId1,userId2,content,messageType,messagedUserId}=req.body;

//     if(!userId1 || !userId2 || !content || !messagedUserId){
//         return res.status(400).json({ message: "All fields are required" });
//     }
//     try{
//         let chat=await IndividualMessage.findOne({userId1,userId2});

//         if(!chat){
//             chat=new IndividualMessage({
//                 communicationId: uuidv4(),
//                 userId1,
//                 userId2,
//                 messages: [{
//                     messageId:uuidv4(),
//                     messagedUserId,
//                     content,
//                     messageType,
//                 }],
//                 updatedAt:new Date(),
//             });
//         }else{
//             chat.messages.push({
//                 messageId:uuidv4(),
//                 messagedUserId,
//                 content,
//                 messageType,
//             });
//             chat.updatedAt=new Date();
//         }
//         await chat.save();
//         res.status(200).json({ message: 'Message sent successfully', chat });
//     }catch(error){
//         console.log(error);
//     }
// }




import { v4 as uuidv4 } from "uuid";
import IndividualMessage from "../models/Message.js";
import { io } from "../server.js"; // Import Socket.IO instance

export const createMessage = async (req, res) => {
    const { userId1, userId2, content, messageType, messagedUserId } = req.body;

    if (!userId1 || !userId2 || !content || !messagedUserId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        let chat = await IndividualMessage.findOne({
            $or: [
                { userId1, userId2 },
                { userId1: userId2, userId2: userId1 }
            ]
        });

        const newMessage = {
            messageId: uuidv4(),
            messagedUserId,
            content,
            messageType,
            status: "sent",
            reaction: "",
            seenAt: null,
            isEdited: false,
            isDeletedSoft: false,
            isDeletedHard: false,
        };

        if (!chat) {
            chat = new IndividualMessage({
                communicationId: uuidv4(),
                userId1,
                userId2,
                messages: [newMessage],
            });
        } else {
            chat.messages.push(newMessage);
        }

        await chat.save();

        // ✅ Emit real-time message to connected clients
        io.emit("receiveMessage", newMessage);

        res.status(200).json({ message: "Message sent successfully", chat });
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

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
