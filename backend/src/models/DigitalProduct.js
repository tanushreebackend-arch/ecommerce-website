const mongoose = require('mongoose');

const digitalProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    fileUrl: { type: String, default: '' },
    fileName: { type: String, default: '' },
    fileType: { type: String, enum: ['pdf', 'zip', 'doc'], default: 'pdf' },
    coverImage: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DigitalProduct', digitalProductSchema);
