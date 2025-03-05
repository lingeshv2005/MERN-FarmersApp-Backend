import express from 'express';
import { addComment, getComments, addReply } from '../controllers/commentsController.js';

const router = express.Router();

// Routes
router.post('/comment/:postId', addComment);            // Add a comment to a post
router.get('/getcomment/:postId', getComments);                 // Get all comments for a post
router.post('/reply/:postId/:commentId', addReply);     // Add a reply to a comment
router.post('/like/:postId/:commentId', addReply);     // Add a reply to a comment

export default router;
