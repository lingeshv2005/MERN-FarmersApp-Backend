import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { uploadPhotos, uploadMiddleware } from "../controllers/photoController.js";

const router = express.Router();

// Convert ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route to upload images
router.post("/upload", uploadMiddleware, uploadPhotos);

// Route to retrieve images
router.get("/:filename", (req, res) => {
    const filePath = path.resolve(__dirname, "../uploads", req.params.filename);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error serving file:", err);
            res.status(404).json({ message: "File not found" });
        }
    });
});

export default router;
