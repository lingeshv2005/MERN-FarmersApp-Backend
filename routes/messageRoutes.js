import express from "express";
import { createMessage, getOrCreateCommunicationId, getMessagesByCommunicationId, getGroupMessagesByCommunicationId, createGroupMessage, createGroup, addMemberToGroup, getGroupByCommunicationId } from "../controllers/messageController.js";

const router = express.Router();


router.post("/create", createMessage);
router.get("/:communicationId", getMessagesByCommunicationId);
router.get("/getOrCreateCommunicationId/:userId1/:userId2", getOrCreateCommunicationId);

router.post("/creategroup", createGroup);
router.post("/addmember", addMemberToGroup);
router.post("/sendmessagetogroup", createGroupMessage);
router.get("/messages/:communicationId", getGroupMessagesByCommunicationId);
router.get("/group-chat/:communicationId", getGroupByCommunicationId);

export default router;