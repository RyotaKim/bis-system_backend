const multer = require('multer');
const { Readable } = require('stream');
const { getGridFSBucket } = require('../config/gridfs');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Middleware to upload file to GridFS
const uploadToGridFS = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const bucket = getGridFSBucket();
    
    // Create a readable stream from buffer
    const readableStream = Readable.from(req.file.buffer);
    
    // Create upload stream
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: {
        uploadedBy: req.user?.id || 'resident',
        uploadedAt: new Date()
      }
    });

    // Upload file
    await new Promise((resolve, reject) => {
      readableStream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => {
          req.file.id = uploadStream.id;
          resolve();
        });
    });

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to delete file from GridFS
const deleteFromGridFS = async (fileId) => {
  try {
    const bucket = getGridFSBucket();
    await bucket.delete(fileId);
  } catch (error) {
    console.error('Error deleting file from GridFS:', error);
    throw error;
  }
};

// Function to get file stream from GridFS
const getFileStream = (fileId) => {
  const bucket = getGridFSBucket();
  return bucket.openDownloadStream(fileId);
};

module.exports = {
  upload,
  uploadToGridFS,
  deleteFromGridFS,
  getFileStream
};
