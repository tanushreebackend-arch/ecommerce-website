const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    coverImage: { type: String, default: '' },
    excerpt: { type: String, maxlength: 200, default: '' },
    content: { type: String, default: '' },
    author: { type: String, default: 'Admin' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
