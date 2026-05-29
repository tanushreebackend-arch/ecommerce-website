const express = require('express');
const { body, validationResult } = require('express-validator');
const Enquiry = require('../models/Enquiry');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const enquiry = await Enquiry.create(req.body);
      res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
