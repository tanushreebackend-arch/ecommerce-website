const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
  {
    headingFont: { type: String, default: 'Playfair Display' },
    bodyFont: { type: String, default: 'Inter' },
    accentFont: { type: String, default: 'Montserrat' },
    primaryColor: { type: String, default: '#000000' },
    secondaryColor: { type: String, default: '#000000' },
    navbarBg: { type: String, default: '#000000' },
    bgColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#444444' },
    announcementBg: { type: String, default: '#000000' },
    announcementText: { type: String, default: '#ffffff' },
    footerBg: { type: String, default: '#000000' },
    sectionAltBg: { type: String, default: '#ffffff' },
    headingColor: { type: String, default: '#000000' },
    linkColor: { type: String, default: '#000000' },
    cardBorderColor: { type: String, default: '#E5E5E5' },
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
