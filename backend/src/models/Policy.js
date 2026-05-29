const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['refund', 'privacy', 'terms', 'shipping'], required: true, unique: true },
    title: String,
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Policy', policySchema);
