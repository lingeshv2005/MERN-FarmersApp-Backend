import express from 'express';
import { updateUserDetails, getUserDetails, addFollower, addHistory } from '../controllers/userDetailsController.js';

const router = express.Router();

router.put('/update/:userId', updateUserDetails);
router.get('/getuserdetails/:userId', getUserDetails);
router.get('/addfollower/:userId',addFollower);
router.get('/addhistory/:userId',addHistory);

export default router;
