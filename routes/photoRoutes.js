import express from 'express';
import { uploadPhoto } from '../controllers/photoController.js';
import multer from 'multer';

const router = express.Router();

// Set up the multer upload middleware for handling file uploads
const upload = multer();

// POST route for uploading photos
router.post('/upload', upload.single('image'), uploadPhoto);

export default router;
