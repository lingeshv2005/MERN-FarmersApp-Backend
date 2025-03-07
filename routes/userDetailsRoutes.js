import express from 'express';
import { updateUserDetails, getUserDetails, addFollower, addHistory, addCommunicationId, getCommunicationIds } from '../controllers/userDetailsController.js';

const router = express.Router();

router.put('/update/:userId', updateUserDetails);
router.get('/getuserdetails/:userId', getUserDetails);
router.put('/addfollower/:userId',addFollower);
router.put('/addhistory/:userId',addHistory);
router.put('/addcommunicationid/:userId',addCommunicationId);
router.get('/:userId/communicationids',getCommunicationIds);

export default router;
