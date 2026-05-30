const express = require('express');
const Theme = require('../models/Theme');
const { formatTheme } = require('../utils/themeFormat');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    const theme = await Theme.findOne();
    res.json(formatTheme(theme));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
