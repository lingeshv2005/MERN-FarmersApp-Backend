import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer file filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Initialize multer with limits and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Controller function for multiple image uploads
export const uploadPhotos = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded!" });
    }

    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

    return res.status(200).json({
      message: "Images uploaded successfully",
      imageUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Export the configured multer instance
export const uploadMiddleware = upload.array("images", 5); // Allows up to 5 images


// get the photo by url
