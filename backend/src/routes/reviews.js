const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');

const router = express.Router();

// Get published reviews
router.get('/published', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(20);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit new review (goes to pending)
router.post(
  '/',
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
      const review = await Review.create(req.body);
      res.status(201).json({ message: 'Review submitted for approval', review });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
