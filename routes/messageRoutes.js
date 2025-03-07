import express from "express";
import { createMessage, getMessages, getMessagesByCommunicationId } from "../controllers/messageController.js";

const router = express.Router();

// ✅ Route for fetching messages
router.get("/messages", getMessages);

// ✅ Route for creating a message
router.post("/create", createMessage);

router.get('/:communicationId', getMessagesByCommunicationId);
export default router;
