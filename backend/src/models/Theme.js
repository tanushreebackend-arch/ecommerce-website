const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
  {
    headingFont: { type: String, default: 'Playfair Display' },
    bodyFont: { type: String, default: 'Inter' },
    accentFont: { type: String, default: 'Montserrat' },
    primaryColor: { type: String, default: '#1a472a' },
    secondaryColor: { type: String, default: '#c9a227' },
    bgColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#1a1a1a' },
    announcementBg: { type: String, default: '#1a472a' },
    announcementText: { type: String, default: '#ffffff' },
    footerBg: { type: String, default: '#1a472a' },
    sectionAltBg: { type: String, default: '#f7f8f5' },
    headingColor: { type: String, default: '#1a1a1a' },
    linkColor: { type: String, default: '#1a472a' },
    cardBorderColor: { type: String, default: '#e5e7eb' },
    announcementVisible: { type: Boolean, default: true },
    pageFonts: {
      type: Map,
      of: {
        headingFont: String,
        bodyFont: String,
        accentFont: String,
      },
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Theme', themeSchema);
