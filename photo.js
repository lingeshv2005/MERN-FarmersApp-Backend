const { 
  express, 
  mongoose, 
  cors, 
  app, 
  port, 
  fs,
  multer,
  path,
  mongourl 
} = require('./import');


app.use(cors());
app.use(express.json());


// ✅ Create 'uploads' directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ✅ FileFilter for specific file type
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/svg"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only image files (JPG, PNG, GIF) are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports={
  upload
};

