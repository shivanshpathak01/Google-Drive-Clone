const express = require('express');
const authMiddleware = require('../middlewares/authe');
const { storage, ID } = require('../config/appwrite.config');
const fileModel = require('../models/files.models');
const fs = require('fs');
const router = express.Router();
const { upload } = require('../config/multer.config');

// 🏠 Route: Home (Fetch user files)
router.get('/home', authMiddleware, async (req, res) => {
    try {
        const userFiles = await fileModel.find({ user: req.user.userId });

        res.render('home', { files: userFiles });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 📤 Route: Upload File to Appwrite
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const fileId = ID.unique();
        const fileData = fs.readFileSync(req.file.path);

        // Upload to Appwrite
        const uploadedFile = await storage.createFile(
            '67b8d5c5000a9b9feb4e', // bucketId
            fileId,
            fileData
        );

        // Save file metadata to MongoDB
        const newFile = await fileModel.create({
            fileId: uploadedFile.$id,
            originalname: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype,
            user: req.user.userId
        });

        // Clean up temporary file
        fs.unlinkSync(req.file.path);

        res.redirect('/home');
    } catch (error) {
        console.error("File upload error:", error);
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ 
            message: "File upload failed", 
            error: error.message 
        });
    }
});

// 📥 Route: Download File (Generate Signed URL)
router.get('/download/:fileId', authMiddleware, async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const file = await fileModel.findOne({
            fileId: fileId,
            user: req.user.userId
        });

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const result = await storage.getFileDownload(
            process.env.APPWRITE_BUCKET_ID,
            fileId
        );

        res.redirect(result.href);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Download failed', error: error.message });
    }
});

module.exports = router;
