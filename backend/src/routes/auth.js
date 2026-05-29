const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { authUser } = require('../middleware/auth');
const { sendWelcomeEmail } = require('../utils/emailTriggers');

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// User signup
router.post(
  '/user/signup',
  [
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { firstName, lastName, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already registered' });

      const user = await User.create({ firstName, lastName, email, password });
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_USER_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('userToken', token, cookieOptions);
      sendWelcomeEmail(user).catch((err) => console.error('[email] Welcome email failed:', err.message));
      res.status(201).json({
        message: 'Account created',
        user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// User login
router.post(
  '/user/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_USER_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('userToken', token, cookieOptions);
      res.json({
        user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// User logout
router.post('/user/logout', (req, res) => {
  res.clearCookie('userToken', cookieOptions);
  res.json({ message: 'Logged out' });
});

// Get current user
router.get('/user/me', authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin login
router.post(
  '/admin/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin || !(await admin.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: 'admin' },
        process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('adminToken', token, cookieOptions);
      res.json({ message: 'Login successful', admin: { email: admin.email } });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Admin logout
router.post('/admin/logout', (req, res) => {
  res.clearCookie('adminToken', cookieOptions);
  res.json({ message: 'Logged out' });
});

// Verify admin session
router.get('/admin/me', async (req, res) => {
  const token = req.cookies?.adminToken;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET);
    res.json({ admin: { email: decoded.email } });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
