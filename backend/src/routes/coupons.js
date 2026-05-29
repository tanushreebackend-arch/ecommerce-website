const express = require('express');
const Coupon = require('../models/Coupon');

const router = express.Router();

/** Public list of coupons customers can pick at checkout */
router.get('/available', async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: now },
      $expr: { $lt: ['$usageCount', '$usageLimit'] },
    })
      .select('code discountType value minOrder')
      .sort({ createdAt: -1 });

    res.json(
      coupons.map((c) => ({
        code: c.code,
        discountType: c.discountType,
        value: c.value,
        minOrder: c.minOrder,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    if (orderTotal < coupon.minOrder) {
      return res.status(400).json({
        message: `Minimum order value of ₹${coupon.minOrder} required`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((orderTotal * coupon.value) / 100);
    } else {
      discount = Math.min(coupon.value, orderTotal);
    }

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.value,
      discount,
      message: 'Coupon applied successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
