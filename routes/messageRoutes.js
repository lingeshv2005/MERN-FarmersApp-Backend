import express from "express";
import { createMessage, getOrCreateCommunicationId, getMessagesByCommunicationId, getGroupMessagesByCommunicationId, createGroupMessage, createGroup, addMemberToGroup, getGroupByCommunicationId } from "../controllers/messageController.js";

const router = express.Router();


// ✅ Route for creating a message
router.post("/create", createMessage);

// ✅ Route for fetching messages by communication ID
router.get("/:communicationId", getMessagesByCommunicationId);

// ✅ Route for getting or creating a communication ID
router.get("/getOrCreateCommunicationId/:userId1/:userId2", getOrCreateCommunicationId);

router.post("/creategroup", createGroup); // Create a group
router.post("/addmember", addMemberToGroup); // Add a member to the group
router.post("/sendmessagetogroup", createGroupMessage); // Send a message in the group
router.get("/messages/:communicationId", getGroupMessagesByCommunicationId); // Get messages by communicationId
router.get("/group-chat/:communicationId", getGroupByCommunicationId);

export default router;

