const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { storage, ID } = require("../config/appwrite.config"); // Appwrite setup

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer Storage
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Add file filter to verify file types
const fileFilter = (req, file, cb) => {
    // Add allowed file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({ 
    storage: multerStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload to Appwrite
const uploadToAppwrite = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const response = await storage.createFile(
            process.env.APPWRITE_BUCKET_ID,
            ID.unique(),
            fs.createReadStream(req.file.path)
        );

        // Delete the local file after successful upload
        fs.unlinkSync(req.file.path);

        req.fileId = response.$id; // Store Appwrite file ID in request
        next();
    } catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { upload, uploadToAppwrite };
