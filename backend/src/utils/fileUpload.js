const fs = require('fs');
const path = require('path');
const { uploadToCloudinary, isCloudinaryConfigured, CLOUDINARY_FOLDER } = require('./cloudinaryUpload');

const UPLOADS_ROOT = path.join(__dirname, '../../public/uploads');

const getBaseUrl = () => process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

function isCloudinaryUrl(url) {
  return typeof url === 'string' && url.includes('res.cloudinary.com');
}

function isCloudinaryAsset(publicId, url) {
  if (isCloudinaryUrl(url)) return true;
  if (!publicId) return false;
  return (
    publicId.startsWith(`${CLOUDINARY_FOLDER}/`) ||
    publicId.startsWith('ecommerce/') ||
    publicId.startsWith('ecommerce-uploads/')
  );
}

/** File already uploaded by multer-storage-cloudinary */
function resolveMulterUpload(file) {
  if (!file) return null;

  if (file.path && isCloudinaryUrl(file.path)) {
    return {
      url: file.path,
      publicId: file.filename || file.public_id,
      size: file.size,
    };
  }

  return null;
}

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
  if (!file) throw new Error('No file provided');

  const fromMulter = resolveMulterUpload(file);
  if (fromMulter) return fromMulter;

  if (!file.buffer) throw new Error('No file provided');

  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadToCloudinary(file.buffer, {
        resourceType: options.resourceType || 'auto',
        folder: options.cloudinaryFolder || CLOUDINARY_FOLDER,
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
  if (!publicId || isCloudinaryAsset(publicId)) return;
  const filepath = path.join(UPLOADS_ROOT, publicId);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
}

/** Upload raw digital files (PDF, ZIP, DOC) — Cloudinary raw or local disk */
async function uploadRawMedia(file) {
  if (!file) throw new Error('No file provided');

  const fromMulter = resolveMulterUpload(file);
  if (fromMulter) {
    return {
      url: fromMulter.url,
      publicId: fromMulter.publicId,
      fileName: file.originalname,
      size: fromMulter.size,
    };
  }

  if (!file.buffer) throw new Error('No file provided');

  if (isCloudinaryConfigured()) {
    try {
      const result = await uploadToCloudinary(file.buffer, {
        resourceType: 'raw',
        folder: `${CLOUDINARY_FOLDER}/digital-files`,
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
        fileName: file.originalname,
        size: file.size,
      };
    } catch (err) {
      console.warn('Cloudinary raw upload failed, falling back to local:', err.message);
    }
  }

  const saved = saveLocal(file, 'digital');
  return {
    url: saved.url,
    publicId: saved.publicId,
    fileName: file.originalname,
    size: saved.size,
  };
}

function detectFileType(filename) {
  const ext = path.extname(filename || '').toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.zip') return 'zip';
  if (ext === '.doc' || ext === '.docx') return 'doc';
  return 'pdf';
}

async function deleteMediaFile(publicId, url) {
  if (!publicId && !url) return;

  if (isCloudinaryConfigured() && isCloudinaryAsset(publicId, url)) {
    try {
      const cloudinary = require('../config/cloudinary');
      let resourceType = 'image';
      if ((url && /\.(mp4|webm|mov)(\?|$)/i.test(url)) || publicId?.includes('/videos/')) {
        resourceType = 'video';
      } else if (publicId?.includes('/digital-files') || (url && /\.(pdf|zip|doc|docx)(\?|$)/i.test(url))) {
        resourceType = 'raw';
      }
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true,
      });
    } catch (err) {
      console.warn('Cloudinary delete failed:', err.message);
    }
    return;
  }

  deleteLocalFile(publicId);
}

module.exports = {
  uploadMedia,
  uploadRawMedia,
  detectFileType,
  resolveMulterUpload,
  isCloudinaryConfigured,
  UPLOADS_ROOT,
  deleteLocalFile,
  deleteMediaFile,
  getBaseUrl,
  CLOUDINARY_FOLDER,
};
