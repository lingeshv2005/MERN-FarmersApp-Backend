import express from 'express';
import { updateUserDetails, getUserDetails } from '../controllers/userDetailsController.js';

const router = express.Router();

// Routes
router.put('/update/:userId', updateUserDetails);  // Update user details
router.get('/get/:userId', getUserDetails);        // Get user details

export default router;
