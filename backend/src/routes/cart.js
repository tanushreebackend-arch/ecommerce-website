const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authUser } = require('../middleware/auth');

const router = express.Router();

router.put(
  '/sync',
  authUser,
  [body('items').isArray()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const items = (req.body.items || []).map((item) => ({
        productId: item.productId,
        packId: item.packId,
        name: item.name,
        packLabel: item.packLabel,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: item.quantity,
        image: item.image,
      }));

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          savedCart: items,
          cartLastUpdated: new Date(),
          cartAbandonedEmailSent: false,
        },
        { new: true }
      ).select('-password');

      res.json({ message: 'Cart synced', cart: user.savedCart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
