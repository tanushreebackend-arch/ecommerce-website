const express = require('express');
const Product = require('../models/Product');
const Pack = require('../models/Pack');
const Section = require('../models/Section');
const Theme = require('../models/Theme');
const Video = require('../models/Video');
const Settings = require('../models/Settings');
const Policy = require('../models/Policy');

const router = express.Router();

// Get all site settings for frontend
router.get('/all', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    const [product, packs, sections, theme, videos, freeShipping, policies] = await Promise.all([
      Product.findOne(),
      Pack.find({ isVisible: true }).sort('sortOrder'),
      Section.find(),
      Theme.findOne(),
      Video.find().sort('slot'),
      Settings.findOne({ key: 'freeShippingThreshold' }),
      Policy.find(),
    ]);

    const sectionsMap = {};
    sections.forEach((s) => {
      sectionsMap[s.name] = { content: s.content, isVisible: s.isVisible };
    });

    const announcementContent = sectionsMap.announcement?.content;
    let freeShippingThreshold = Number(freeShipping?.value) || 499;

    if (announcementContent?.shippingThreshold != null && announcementContent.shippingThreshold !== '') {
      const parsed = Number(announcementContent.shippingThreshold);
      if (!Number.isNaN(parsed) && parsed > 0) freeShippingThreshold = parsed;
    } else if (announcementContent?.text) {
      const match = String(announcementContent.text).match(/[₹$]\s*([\d,]+)/);
      if (match) {
        const parsed = Number(match[1].replace(/,/g, ''));
        if (!Number.isNaN(parsed) && parsed > 0) freeShippingThreshold = parsed;
      }
    }

    const policiesMap = {};
    policies.forEach((p) => {
      policiesMap[p.type] = { title: p.title, content: p.content };
    });

    res.json({
      product: product || {},
      packs: packs || [],
      sections: sectionsMap,
      theme: theme || {},
      videos: videos || [],
      freeShippingThreshold,
      policies: policiesMap,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get policy by type
router.get('/policies/:type', async (req, res) => {
  try {
    const policy = await Policy.findOne({ type: req.params.type });
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get contact page content
router.get('/contact', async (req, res) => {
  try {
    const section = await Section.findOne({ name: 'contact' });
    res.json(section?.content || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
