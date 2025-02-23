const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileId: {  // Appwrite file ID
        type: String,
        required: [true, 'File ID is required']
    },
    originalname: {
        type: String,
        required: [true, 'Original name is required']
    },
    size: {
        type: Number,
        required: [true, 'File size is required']
    },
    mimeType: {
        type: String,
        required: [true, 'MIME type is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'User is required']
    }
}, {
    timestamps: true
});

const file = mongoose.model('file', fileSchema);

module.exports = file;