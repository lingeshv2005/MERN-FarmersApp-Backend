import express from 'express';
import { updateUserDetails, getUserDetails, addFollower, addHistory } from '../controllers/userDetailsController.js';

const router = express.Router();

router.put('/update/:userId', updateUserDetails);
router.get('/getuserdetails/:userId', getUserDetails);
router.put('/addfollower/:userId',addFollower);
router.put('/addhistory/:userId',addHistory);

export default router;
