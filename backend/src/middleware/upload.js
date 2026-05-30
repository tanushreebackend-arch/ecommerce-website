const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { isCloudinaryConfigured } = require('../utils/cloudinaryUpload');

const CLOUDINARY_FOLDER = 'ecommerce-uploads';

const IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_MIMES = ['video/mp4', 'video/webm'];

const imageFileFilter = (req, file, cb) => {
  if (IMAGE_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image type. Allowed: jpg, jpeg, png, webp, gif'), false);
  }
};

const mediaFileFilter = (req, file, cb) => {
  const allowed = [...IMAGE_MIMES, ...VIDEO_MIMES];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

function createImageStorage() {
  if (isCloudinaryConfigured()) {
    return new CloudinaryStorage({
      cloudinary,
      params: {
        folder: CLOUDINARY_FOLDER,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        resource_type: 'image',
      },
    });
  }
  return multer.memoryStorage();
}

/** Image uploads — Cloudinary when configured, else memory → local disk via uploadMedia */
const imageUpload = multer({
  storage: createImageStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: imageFileFilter,
});

/** Video + thumbnail uploads — always memory (videos uploaded via uploadMedia stream) */
const videoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: mediaFileFilter,
});

imageUpload.videoUpload = videoUpload;

const DIGITAL_MIMES = [
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const digitalFileFilter = (req, file, cb) => {
  if (DIGITAL_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: PDF, ZIP, DOC, DOCX'), false);
  }
};

/** Digital product files — memory buffer → Cloudinary raw or local */
imageUpload.digitalFileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: digitalFileFilter,
});

imageUpload.CLOUDINARY_FOLDER = CLOUDINARY_FOLDER;

module.exports = imageUpload;
