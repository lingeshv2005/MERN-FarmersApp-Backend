import express from 'express';
import { searchUsers } from '../controllers/usersController.js';

const router = express.Router();

router.get("/search", searchUsers); // ✅ New route for searching users

export default router;
