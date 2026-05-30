const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const { uploadMedia } = require('../utils/fileUpload');

const router = express.Router();

const IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_MIMES = ['video/mp4', 'video/webm', 'video/quicktime'];

const reviewUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'photo') {
      if (IMAGE_MIMES.includes(file.mimetype)) return cb(null, true);
      return cb(new Error('Invalid image type. Allowed: jpg, jpeg, png, webp, gif'), false);
    }
    if (file.fieldname === 'video') {
      if (VIDEO_MIMES.includes(file.mimetype)) return cb(null, true);
      return cb(new Error('Invalid video type. Allowed: mp4, webm'), false);
    }
    cb(new Error('Unexpected field'), false);
  },
}).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

// Get published reviews (all approved, pinned first)
router.get('/published', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ isPinned: -1, createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit new review (goes to pending)
router.post(
  '/',
  (req, res, next) => {
    reviewUpload(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message || 'Upload failed' });
      next();
    });
  },
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').trim().notEmpty(),
    body('text').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const reviewData = {
        name: req.body.name,
        email: req.body.email,
        rating: Number(req.body.rating),
        title: req.body.title,
        text: req.body.text,
      };

      const files = req.files || {};

      if (files.photo?.[0]) {
        const result = await uploadMedia(files.photo[0], { resourceType: 'image' });
        reviewData.photo = { url: result.url, publicId: result.publicId };
      }

      if (files.video?.[0]) {
        const result = await uploadMedia(files.video[0], { resourceType: 'video' });
        reviewData.video = { url: result.url, publicId: result.publicId };
      }

      const review = await Review.create(reviewData);
      res.status(201).json({ message: 'Review submitted for approval', review });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
