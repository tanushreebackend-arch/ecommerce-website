const isCloudinaryConfigured = () => {
  const name = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
  const key = (process.env.CLOUDINARY_API_KEY || '').trim();
  const secret = (process.env.CLOUDINARY_API_SECRET || '').trim();
  return Boolean(name && key && secret);
};

const uploadToCloudinary = (buffer, options = {}) => {
  if (!isCloudinaryConfigured()) {
    return Promise.reject(new Error('Cloudinary is not configured'));
  }
  const cloudinary = require('../config/cloudinary');
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ecommerce',
        resource_type: options.resourceType || 'auto',
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

module.exports = { uploadToCloudinary, isCloudinaryConfigured };
