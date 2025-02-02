import express from 'express';
import {
    createPost,
    getPost,
    getPostsByUser,
    getAllPosts,
    updatePost,
    addLike,
    addRepost,
    addView
} from '../controllers/postController.js';

const router = express.Router();

router.post('/createpost', createPost);
router.get('/getpost/:postId', getPost);
router.get('/getpost/user/:userId', getPostsByUser);
router.get('/getposts', getAllPosts);
router.put('/updatepost/:postId', updatePost);
router.put('/addlike/:postId', addLike);
router.put('/addrepost/:postId', addRepost);
router.put('/addview/:postId', addView);

export default router;
