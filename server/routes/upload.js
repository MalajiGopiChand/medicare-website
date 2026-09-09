const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadFile, uploadToCloudinary, upload } = require('../utils/fileUpload');
const fs = require('fs');

// Upload single file
router.post('/single', auth, uploadFile, async (req, res) => {
  try {
    const file = req.file;
    
    res.json({
      message: 'File uploaded successfully',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: file.cloudinaryUrl || `/uploads/${file.filename}`,
      localPath: file.localPath
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload multiple files
router.post('/multiple', auth, upload.array('files', 10), async (req, res) => {
  try {
    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/${file.filename}`
    }));
    
    res.json({
      message: 'Files uploaded successfully',
      files
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

