const fs = require('fs');
const path = require('path');
const { uploadToCloudinary, isCloudinaryConfigured } = require('./cloudinaryUpload');

const UPLOADS_ROOT = path.join(__dirname, '../../public/uploads');

const getBaseUrl = () => process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

/** Save file buffer locally under public/uploads/{subdir}/ */
function saveLocal(file, subdir = 'images') {
  const dir = path.join(UPLOADS_ROOT, subdir);
  fs.mkdirSync(dir, { recursive: true });

  const ext = path.extname(file.originalname) || (file.mimetype?.includes('video') ? '.mp4' : '.jpg');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`;
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, file.buffer);

  return {
    url: `${getBaseUrl()}/uploads/${subdir}/${filename}`,
    publicId: `${subdir}/${filename}`,
    localPath: filepath,
    filename,
    size: file.size,
  };
}

/** Upload image or video — Cloudinary if configured, else local disk */
async function uploadMedia(file, options = {}) {
  if (!file?.buffer) throw new Error('No file provided');

  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadToCloudinary(file.buffer, {
        resourceType: options.resourceType || 'auto',
        folder: options.cloudinaryFolder || 'ecommerce',
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
        size: file.size,
      };
    } catch (err) {
      console.warn('Cloudinary upload failed, falling back to local:', err.message);
    }
  }

  const subdir = options.localSubdir || (options.resourceType === 'video' ? 'videos' : 'images');
  return saveLocal(file, subdir);
}

function deleteLocalFile(publicId) {
  if (!publicId || publicId.includes('cloudinary')) return;
  const filepath = path.join(UPLOADS_ROOT, publicId);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
}

module.exports = { uploadMedia, isCloudinaryConfigured, UPLOADS_ROOT, deleteLocalFile, getBaseUrl };
