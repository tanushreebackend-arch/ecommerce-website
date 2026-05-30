const express = require('express');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const DigitalProduct = require('../models/DigitalProduct');
const { authAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadMedia, uploadRawMedia, detectFileType } = require('../utils/fileUpload');
const { sendEmail } = require('../utils/sendEmail');
const { digitalProductPurchaseTemplate } = require('../utils/emailTemplates');
const getEmailBrandContext = require('../utils/getEmailBrandContext');

const router = express.Router();

function verifyRazorpaySignature(orderId, paymentId, signature) {
  if (!process.env.RAZORPAY_KEY_SECRET) return true;
  if (!orderId || !paymentId || !signature) return false;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expected === signature;
}

// Admin: list all products (including inactive)
router.get('/all', authAdmin, async (req, res) => {
  try {
    const products = await DigitalProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: active products only
router.get('/', async (req, res) => {
  try {
    const products = await DigitalProduct.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: upload digital file (PDF, ZIP, DOC) — before /:id routes
router.post('/upload-file', authAdmin, upload.digitalFileUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await uploadRawMedia(req.file);
    res.json({
      fileUrl: result.url,
      fileName: result.fileName || req.file.originalname,
      fileType: detectFileType(req.file.originalname),
      publicId: result.publicId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: upload cover image
router.post('/upload-cover', authAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    const result = await uploadMedia(req.file, { resourceType: 'image', localSubdir: 'digital-covers' });
    res.json({ url: result.url, publicId: result.publicId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: single product (any status)
router.get('/manage/:id', authAdmin, async (req, res) => {
  try {
    const product = await DigitalProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: single active product
router.get('/:id', async (req, res) => {
  try {
    const product = await DigitalProduct.findOne({ _id: req.params.id, status: 'active' });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: create
router.post(
  '/',
  authAdmin,
  [
    body('title').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('status').optional().isIn(['active', 'inactive']),
    body('fileUrl').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { title, description, price, fileUrl, fileName, fileType, coverImage, status } = req.body;
      if (!fileUrl) return res.status(400).json({ message: 'Product file is required' });

      const product = await DigitalProduct.create({
        title,
        description: description || '',
        price,
        fileUrl,
        fileName: fileName || '',
        fileType: fileType || detectFileType(fileName),
        coverImage: coverImage || '',
        status: status || 'active',
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Admin: update
router.put(
  '/:id',
  authAdmin,
  [
    body('title').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('status').optional().isIn(['active', 'inactive']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const product = await DigitalProduct.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Admin: delete
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const product = await DigitalProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public: purchase — verify payment and email download link
router.post(
  '/:id/purchase',
  [
    body('customerEmail').isEmail().normalizeEmail(),
    body('customerName').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const product = await DigitalProduct.findOne({ _id: req.params.id, status: 'active' });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      if (!product.fileUrl) return res.status(400).json({ message: 'Product file not available' });

      const {
        customerEmail,
        customerName,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      } = req.body;

      const hasRazorpay = Boolean(process.env.RAZORPAY_KEY_SECRET);
      if (hasRazorpay) {
        const valid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!valid) {
          return res.status(400).json({ message: 'Payment verification failed' });
        }
      }

      const brand = await getEmailBrandContext();
      const html = digitalProductPurchaseTemplate({
        brandName: brand.brandName,
        logoUrl: brand.logoUrl,
        copyright: brand.copyright,
        websiteUrl: brand.websiteUrl,
        customerName: customerName || 'there',
        productTitle: product.title,
        fileName: product.fileName,
        fileType: product.fileType,
        price: product.price,
        downloadUrl: product.fileUrl,
        orderId: razorpayPaymentId || `DP-${Date.now()}`,
      });

      await sendEmail({
        to: customerEmail,
        subject: `Your download: ${product.title}`,
        html,
      });

      res.json({
        success: true,
        message: 'Download link sent to your email',
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
