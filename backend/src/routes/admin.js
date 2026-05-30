const express = require('express');
const Product = require('../models/Product');
const Pack = require('../models/Pack');
const Section = require('../models/Section');
const Theme = require('../models/Theme');
const { formatTheme } = require('../utils/themeFormat');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const Order = require('../models/Order');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');
const Video = require('../models/Video');
const Policy = require('../models/Policy');
const Settings = require('../models/Settings');
const { authAdmin } = require('../middleware/auth');
const { getEmailSettings, saveEmailSettings } = require('../utils/emailSettings');
const getEmailBrandContext = require('../utils/getEmailBrandContext');
const { applyEmailVars } = require('../utils/emailVars');
const {
  welcomeEmailTemplate,
  orderConfirmationTemplate,
  abandonedCartTemplate,
  digitalProductPurchaseTemplate,
} = require('../utils/emailTemplates');
const upload = require('../middleware/upload');
const { uploadMedia, deleteMediaFile } = require('../utils/fileUpload');
const { sendEmail } = require('../utils/sendEmail');

const router = express.Router();

router.use(authAdmin);

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildDailyChartData(dailyAgg, days = 7) {
  const map = new Map(dailyAgg.map((row) => [row._id, row]));
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const key = formatDateKey(date);
    const row = map.get(key);

    result.push({
      date: key,
      label: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      orders: row?.orders || 0,
      revenue: row?.revenue || 0,
    });
  }

  return result;
}

// Dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const chartStart = new Date(today);
    chartStart.setDate(chartStart.getDate() - 6);

    const [
      ordersToday,
      ordersMonth,
      revenueToday,
      revenueMonth,
      pendingReviews,
      newEnquiries,
      totalCustomers,
      totalProducts,
      totalOrders,
      totalRevenue,
      product,
      dailyStats,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ createdAt: { $gte: monthStart } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: monthStart }, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Review.countDocuments({ status: 'pending' }),
      Enquiry.countDocuments({ $or: [{ status: 'unread' }, { status: { $exists: false }, isRead: false }] }),
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.findOne(),
      Order.aggregate([
        { $match: { createdAt: { $gte: chartStart } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Kolkata' },
            },
            orders: { $sum: 1 },
            revenue: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$total', 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderId customerName total orderStatus createdAt');

    res.json({
      ordersToday,
      ordersMonth,
      revenueToday: revenueToday[0]?.total || 0,
      revenueMonth: revenueMonth[0]?.total || 0,
      pendingReviews,
      newEnquiries,
      totalCustomers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      lowStock: product?.stock < 10,
      stockCount: product?.stock || 0,
      chartData: buildDailyChartData(dailyStats),
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Product management
router.get('/product', async (req, res) => {
  try {
    const product = await Product.findOne();
    res.json(product || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/product', async (req, res) => {
  try {
    let product = await Product.findOne();
    if (!product) product = await Product.create(req.body);
    else {
      Object.assign(product, req.body);
      await product.save();
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/product/images', upload.array('images', 10), async (req, res) => {
  try {
    const product = await Product.findOne();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!req.files?.length) return res.status(400).json({ message: 'No images provided' });

    const uploaded = [];
    for (const file of req.files) {
      const result = await uploadMedia(file, { resourceType: 'image' });
      uploaded.push({
        url: result.url,
        publicId: result.publicId,
        sortOrder: product.images.length + uploaded.length,
      });
    }

    product.images.push(...uploaded);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/product/images/reorder', async (req, res) => {
  try {
    const product = await Product.findOne();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { order } = req.body;
    if (!Array.isArray(order)) return res.status(400).json({ message: 'order must be an array of indices' });

    const reordered = order.map((idx, i) => {
      const img = product.images[idx];
      if (!img) throw new Error(`Invalid image index: ${idx}`);
      return {
        url: img.url,
        publicId: img.publicId,
        sortOrder: i,
      };
    });

    product.images = reordered;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/product/images/:index/replace', upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findOne();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const index = parseInt(req.params.index, 10);
    if (Number.isNaN(index) || index < 0 || index >= product.images.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }
    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    const old = product.images[index];
    deleteMediaFile(old?.publicId, old?.url);

    const result = await uploadMedia(req.file, { resourceType: 'image' });
    product.images[index] = {
      url: result.url,
      publicId: result.publicId,
      sortOrder: old.sortOrder ?? index,
    };
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/product/images/:index', async (req, res) => {
  try {
    const product = await Product.findOne();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const index = parseInt(req.params.index, 10);
    if (Number.isNaN(index) || index < 0 || index >= product.images.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }

    const removed = product.images[index];
    await deleteMediaFile(removed?.publicId, removed?.url);
    product.images.splice(index, 1);
    product.images.forEach((img, i) => { img.sortOrder = i; });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const DEFAULT_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&fit=crop',
  'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&fit=crop',
  'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=800&fit=crop',
  'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&fit=crop',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&fit=crop',
];

router.put('/product/images/apply-defaults', async (req, res) => {
  try {
    const product = await Product.findOne();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.images = DEFAULT_PRODUCT_IMAGES.map((url, i) => ({ url, sortOrder: i }));
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/product/logo', upload.single('logo'), async (req, res) => {
  try {
    const product = await Product.findOne();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!req.file) return res.status(400).json({ message: 'No logo provided' });

    if (product.logo?.publicId) await deleteMediaFile(product.logo.publicId, product.logo.url);

    const result = await uploadMedia(req.file, { resourceType: 'image' });
    product.logo = { url: result.url, publicId: result.publicId };
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/product/comparison-image', upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findOne();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    if (product.comparisonImage?.publicId) await deleteMediaFile(product.comparisonImage.publicId, product.comparisonImage.url);

    const result = await uploadMedia(req.file, { resourceType: 'image' });
    product.comparisonImage = { url: result.url, publicId: result.publicId };
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/product/images/by-public-id/:publicId(*)', async (req, res) => {
  try {
    const product = await Product.findOne();
    const publicId = req.params.publicId;
    const index = product.images.findIndex((img) => img.publicId === publicId);
    if (index === -1) return res.status(404).json({ message: 'Image not found' });

    await deleteMediaFile(product.images[index]?.publicId, product.images[index]?.url);
    product.images.splice(index, 1);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Packs management
router.get('/packs', async (req, res) => {
  try {
    const packs = await Pack.find().sort('sortOrder');
    res.json(packs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/packs', async (req, res) => {
  try {
    const pack = await Pack.create(req.body);
    res.status(201).json(pack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/packs/:id', async (req, res) => {
  try {
    const pack = await Pack.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/packs/:id', async (req, res) => {
  try {
    await Pack.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pack deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Free shipping threshold
router.get('/settings/shipping', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: 'freeShippingThreshold' });
    res.json({ threshold: setting?.value || 499 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/settings/shipping', async (req, res) => {
  try {
    const threshold = Number(req.body.threshold);
    if (Number.isNaN(threshold) || threshold <= 0) {
      return res.status(400).json({ message: 'Invalid threshold' });
    }

    const setting = await Settings.findOneAndUpdate(
      { key: 'freeShippingThreshold' },
      { value: threshold },
      { upsert: true, new: true }
    );

    const announcement = await Section.findOne({ name: 'announcement' });
    const content = announcement?.content || {};
    const text = String(content.text || 'FREE SHIPPING ON ALL ORDERS ABOVE ₹499');
    const updatedText = /[₹$]\s*[\d,]+/.test(text)
      ? text.replace(/[₹$]\s*[\d,]+/, `₹${threshold.toLocaleString('en-IN')}`)
      : `FREE SHIPPING ON ALL ORDERS ABOVE ₹${threshold.toLocaleString('en-IN')}`;

    await Section.findOneAndUpdate(
      { name: 'announcement' },
      { content: { ...content, shippingThreshold: threshold, text: updatedText } },
      { upsert: true }
    );

    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sections management
router.get('/sections', async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/sections/:name', async (req, res) => {
  try {
    const section = await Section.findOne({ name: req.params.name });
    res.json(section || { name: req.params.name, content: {} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/sections/:name', async (req, res) => {
  try {
    const section = await Section.findOneAndUpdate(
      { name: req.params.name },
      { content: req.body.content, isVisible: req.body.isVisible ?? true },
      { upsert: true, new: true }
    );

    // Keep cart/checkout in sync when admin updates announcement bar threshold
    if (req.params.name === 'announcement' && req.body.content) {
      let threshold = req.body.content.shippingThreshold;
      if (threshold == null || threshold === '') {
        const match = String(req.body.content.text || '').match(/[₹$]\s*([\d,]+)/);
        if (match) threshold = Number(match[1].replace(/,/g, ''));
      } else {
        threshold = Number(threshold);
      }
      if (!Number.isNaN(threshold) && threshold > 0) {
        await Settings.findOneAndUpdate(
          { key: 'freeShippingThreshold' },
          { value: threshold },
          { upsert: true }
        );
      }
    }

    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/sections/:name/image', upload.single('image'), async (req, res) => {
  try {
    const result = await uploadMedia(req.file, { resourceType: 'image' });
    res.json({ url: result.url, publicId: result.publicId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Theme management
router.get('/theme', async (req, res) => {
  try {
    const theme = await Theme.findOne();
    res.json(formatTheme(theme));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/theme', async (req, res) => {
  try {
    const body = { ...req.body };
    // Map normalized names to schema fields if sent from admin
    if (body.buttonColor && !body.primaryColor) body.primaryColor = body.buttonColor;
    if (body.accentColor && !body.secondaryColor) body.secondaryColor = body.accentColor;
    if (body.navbarColor && !body.navbarBg) body.navbarBg = body.navbarColor;

    let theme = await Theme.findOne();
    if (!theme) theme = await Theme.create(body);
    else {
      Object.assign(theme, body);
      await theme.save();
    }
    res.json(formatTheme(theme));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Coupons management
router.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/coupons/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reviews management
router.get('/reviews/pending', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/reviews/published', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ isPinned: -1, createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/reviews/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/reviews/:id/reject', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/reviews/:id/pin', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isPinned: req.body.isPinned }, { new: true });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/reviews/:id/unpublish', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: 'pending', isPinned: false }, { new: true });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/reviews/:id/photo', upload.single('photo'), async (req, res) => {
  try {
    const result = await uploadMedia(req.file, { resourceType: 'image' });
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { photo: { url: result.url, publicId: result.publicId } },
      { new: true }
    );
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enquiries management
router.get('/enquiries', async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
      : {};
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/enquiries/:id/read', async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

    if (enquiry.status !== 'replied') {
      enquiry.isRead = true;
      enquiry.status = 'read';
      await enquiry.save();
    }

    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/enquiries/:id/reply', async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage || !String(replyMessage).trim()) {
      return res.status(400).json({ message: 'Reply message is required' });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

    const messageHtml = String(replyMessage)
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');

    await sendEmail({
      to: enquiry.email,
      subject: 'Re: Your Enquiry — NOW Foods',
      html: `
        <p>Hi ${enquiry.name},</p>
        <p>${messageHtml}</p>
        <p style="color:#666;font-size:13px;margin-top:24px;">— NOW Foods Customer Support</p>
      `,
    });

    enquiry.status = 'replied';
    enquiry.isRead = true;
    await enquiry.save();

    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/enquiries/:id', async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Orders management
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id.toUpperCase() }).catch(() => null)
      || await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { $or: [{ orderId: req.params.id.toUpperCase() }, { _id: req.params.id }] },
      {
        orderStatus: req.body.orderStatus,
        trackingNumber: req.body.trackingNumber,
        courierName: req.body.courierName,
      },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Videos management
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort('slot');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/videos/:slot', upload.videoUpload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const slot = parseInt(req.params.slot);
    let videoData = {};

    if (req.files?.video?.[0]) {
      const file = req.files.video[0];
      const result = await uploadMedia(file, { resourceType: 'video', localSubdir: 'videos' });
      videoData = {
        cloudinaryUrl: result.url,
        publicId: result.publicId,
        fileSize: file.size,
        duration: req.body.duration ? parseFloat(req.body.duration) : undefined,
        thumbnailUrl: result.url.replace(/\.[^.]+$/, '.jpg'),
      };
    }

    if (req.files?.thumbnail?.[0]) {
      const thumb = await uploadMedia(req.files.thumbnail[0], { resourceType: 'image' });
      videoData.thumbnailUrl = thumb.url;
    }

    const video = await Video.findOneAndUpdate({ slot }, { slot, ...videoData }, { upsert: true, new: true });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Policies management
router.get('/policies/:type', async (req, res) => {
  try {
    const policy = await Policy.findOne({ type: req.params.type });
    res.json(policy || { type: req.params.type, content: '' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/policies/:type', async (req, res) => {
  try {
    const policy = await Policy.findOneAndUpdate(
      { type: req.params.type },
      { title: req.body.title, content: req.body.content },
      { upsert: true, new: true }
    );
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// COD settings
router.get('/settings/cod', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: 'codEnabled' });
    res.json({ enabled: setting?.value ?? false });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/settings/cod', async (req, res) => {
  try {
    const setting = await Settings.findOneAndUpdate(
      { key: 'codEnabled' },
      { value: req.body.enabled },
      { upsert: true, new: true }
    );
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Email settings
router.get('/emails/settings', async (req, res) => {
  try {
    const settings = await getEmailSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/emails/settings', async (req, res) => {
  try {
    const settings = await saveEmailSettings(req.body);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/emails/preview/:type', async (req, res) => {
  try {
    const ctx = await getEmailBrandContext();
    const { type } = req.params;
    let html = '';

    if (type === 'welcome') {
      html = welcomeEmailTemplate({
        name: 'Alex',
        brandName: ctx.storeName,
        logoUrl: ctx.logoUrl,
        websiteUrl: ctx.websiteUrl,
        copyright: ctx.copyright,
        ctaText: ctx.emailSettings.welcomeCtaText,
        bodyContent: applyEmailVars(ctx.emailSettings.welcomeBodyText, {
          storeName: ctx.storeName,
          name: 'Alex',
        }),
      });
    } else if (type === 'order') {
      html = orderConfirmationTemplate({
        name: 'Alex Johnson',
        orderId: 'ORD-12345',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [
          { name: ctx.productName, packLabel: '60 Tablets', quantity: 1, price: 2499 },
          { name: ctx.productName, packLabel: '120 Tablets', quantity: 2, price: 4499 },
        ],
        subtotal: 11497,
        shipping: 0,
        discount: 500,
        total: 10997,
        paymentMethod: 'UPI',
        address: {
          name: 'Alex Johnson',
          phone: '+91 98765 43210',
          address: '12 MG Road, Apt 4B',
          city: 'Bangalore',
          pincode: '560001',
        },
        brandName: ctx.storeName,
        logoUrl: ctx.logoUrl,
        trackOrderUrl: `${ctx.websiteUrl}/track-order`,
        websiteUrl: ctx.websiteUrl,
        copyright: ctx.copyright,
        ctaText: ctx.emailSettings.orderCtaText,
      });
    } else if (type === 'abandoned') {
      html = abandonedCartTemplate({
        name: 'Alex',
        cartItems: [
          {
            name: ctx.productName,
            packLabel: '60 Tablets',
            price: 2499,
            quantity: 1,
            image: ctx.logoUrl,
          },
        ],
        brandName: ctx.storeName,
        logoUrl: ctx.logoUrl,
        checkoutUrl: `${ctx.websiteUrl}/checkout`,
        websiteUrl: ctx.websiteUrl,
        copyright: ctx.copyright,
        stockLeft: 12,
        urgencyText: ctx.emailSettings.abandonedCartUrgencyText,
        ctaText: ctx.emailSettings.abandonedCartCtaText,
        bodyContent: applyEmailVars(ctx.emailSettings.abandonedCartBodyText, {
          storeName: ctx.storeName,
          name: 'Alex',
          productName: ctx.productName,
        }),
      });
    } else if (type === 'digital') {
      html = digitalProductPurchaseTemplate({
        brandName: ctx.storeName,
        logoUrl: ctx.logoUrl,
        copyright: ctx.copyright,
        websiteUrl: ctx.websiteUrl,
        customerName: 'Alex',
        productTitle: 'Wellness Guide PDF',
        fileName: 'wellness-guide.pdf',
        fileType: 'pdf',
        price: 499,
        downloadUrl: `${ctx.websiteUrl}/digital-products/sample/download`,
        orderId: 'DIG-12345',
      });
    } else {
      return res.status(400).json({ message: 'Invalid preview type' });
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.send(html);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/blogs/cover-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    const result = await uploadMedia(req.file, { resourceType: 'image', localSubdir: 'blog' });
    res.json({ url: result.url, publicId: result.publicId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
