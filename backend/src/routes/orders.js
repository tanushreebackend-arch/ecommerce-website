const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');
const User = require('../models/User');
const generateOrderId = require('../utils/generateOrderId');
const { sendOrderConfirmationEmail } = require('../utils/emailTriggers');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Create Razorpay order
router.post('/create-payment', optionalAuth, async (req, res) => {
  try {
    const { amount } = req.body;
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.json({ mock: true, orderId: `mock_${Date.now()}`, amount: amount * 100 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify Razorpay payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mock')
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature || !process.env.RAZORPAY_KEY_SECRET;
    res.json({ verified: isValid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post(
  '/',
  optionalAuth,
  [
    body('customerEmail').isEmail(),
    body('items').isArray({ min: 1 }),
    body('total').isNumeric(),
    body('shippingAddress').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const {
        items,
        subtotal,
        discount,
        shippingCost,
        total,
        couponUsed,
        shippingAddress,
        shippingMethod,
        paymentMethod,
        customerEmail,
        customerName,
        customerPhone,
        razorpayOrderId,
        razorpayPaymentId,
      } = req.body;

      // Increment coupon usage if used
      if (couponUsed) {
        await Coupon.findOneAndUpdate({ code: couponUsed.toUpperCase() }, { $inc: { usageCount: 1 } });
      }

      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

      const order = await Order.create({
        orderId: generateOrderId(),
        user: req.user?.id,
        customerName: customerName || `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        customerEmail,
        customerPhone: customerPhone || shippingAddress.phone,
        items,
        subtotal,
        discount: discount || 0,
        shippingCost: shippingCost || 0,
        total,
        couponUsed,
        shippingAddress,
        shippingMethod: shippingMethod || 'standard',
        paymentMethod: paymentMethod || 'razorpay',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        razorpayOrderId,
        razorpayPaymentId,
        orderStatus: 'pending',
        estimatedDelivery,
      });

      if (req.user?.id) {
        await User.findByIdAndUpdate(req.user.id, {
          savedCart: [],
          cartLastUpdated: null,
          cartAbandonedEmailSent: false,
        });
      }

      sendOrderConfirmationEmail(order).catch((err) =>
        console.error('[email] Order confirmation failed:', err.message)
      );

      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Track order by ID + email
router.post('/track', async (req, res) => {
  try {
    const { orderId, email } = req.body;
    if (!orderId || !email) {
      return res.status(400).json({ message: 'Order ID and email required' });
    }

    const order = await Order.findOne({
      orderId: orderId.toUpperCase(),
      customerEmail: email.toLowerCase(),
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id.toUpperCase() });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get free shipping threshold
router.get('/settings/shipping', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: 'freeShippingThreshold' });
    res.json({ threshold: setting?.value || 499 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
