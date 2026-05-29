const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    slot: { type: Number, required: true, unique: true, min: 1, max: 4 },
    cloudinaryUrl: String,
    publicId: String,
    thumbnailUrl: String,
    fileSize: Number,
    duration: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
