const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Premium Wellness Supplement' },
    brandName: { type: String, default: 'Premium Wellness' },
    salePrice: { type: Number, default: 999 },
    mrp: { type: Number, default: 3499 },
    stock: { type: Number, default: 47 },
    rating: { type: Number, default: 4.7 },
    ratingText: { type: String, default: 'Loved by 400+ customers' },
    description: {
      type: String,
      default: 'A premium daily supplement crafted with nature\'s finest ingredients to boost energy, immunity, and overall wellness.',
    },
    benefits: {
      type: [String],
      default: [
        'Boosts natural energy levels',
        'Supports immune system health',
        'Enhances mental clarity & focus',
        'Promotes faster recovery',
        '100% natural ingredients',
      ],
    },
    images: {
      type: [{ url: String, publicId: String, sortOrder: Number }],
      default: [],
    },
    attributes: {
      type: [{ label: String, value: String }],
      default: [
        { label: 'Weight', value: '300mg' },
        { label: 'Capsules', value: '30' },
        { label: 'Servings', value: '30 Days' },
      ],
    },
    deliveryText: { type: String, default: 'Expected delivery in 3-5 business days' },
    logo: { url: String, publicId: String },
    comparisonImage: { url: String, publicId: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
