import express from "express";
import { createMessage, getOrCreateCommunicationId, getMessagesByCommunicationId, getGroupMessagesByCommunicationId, createGroupMessage, createGroup, addMemberToGroup, getGroupByCommunicationId, getMessagesIfCommunicationExists } from "../controllers/messageController.js";
import { createChannel, getChannelByCommunicationId, getChannelMessages, getChannelsForUser, joinChannel, sendMessageToChannel, updateMessageStatus } from "../controllers/channelController.js";

const router = express.Router();


router.post("/create", createMessage);
router.get("/:communicationId", getMessagesByCommunicationId);
router.get("/getOrCreateCommunicationId/:userId1/:userId2", getOrCreateCommunicationId);
router.get("/getMessagesIfExists/:userId1/:userId2", getMessagesIfCommunicationExists);

router.post("/creategroup", createGroup);
router.post("/addmember", addMemberToGroup);
router.post("/sendmessagetogroup", createGroupMessage);
router.get("/messages/:communicationId", getGroupMessagesByCommunicationId);
router.get("/group-chat/:communicationId", getGroupByCommunicationId);


router.post("/createchannel", createChannel);              
router.post("/channel/join/:communicationId", joinChannel);
router.post("/sendmessage", sendMessageToChannel);
router.get("/channel/messages/:communicationId", getChannelMessages);
router.get("/channel/:communicationId", getChannelByCommunicationId);
router.post("/channel/message/status", updateMessageStatus);
router.get("/userchannels/:userId", getChannelsForUser);


export default router;