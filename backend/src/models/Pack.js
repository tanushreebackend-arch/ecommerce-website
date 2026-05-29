const mongoose = require('mongoose');

const packSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    savingsPercent: { type: Number, default: 72 },
    badge: { type: String, default: 'BEST VALUE' },
    isVisible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pack', packSchema);
