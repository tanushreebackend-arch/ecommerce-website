const Theme = require('../models/Theme');
const Product = require('../models/Product');
const Section = require('../models/Section');
const { getEmailSettings } = require('./emailSettings');

async function getEmailBrandContext() {
  const [theme, product, navbar, emailSettings] = await Promise.all([
    Theme.findOne().lean(),
    Product.findOne().lean(),
    Section.findOne({ name: 'navbar' }).lean(),
    getEmailSettings(),
  ]);

  const websiteUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
  const brandName = String(
    product?.brandName || navbar?.content?.brandName || process.env.EMAIL_FROM_NAME || 'NOW FOODS'
  ).toUpperCase();

  let logoUrl = navbar?.content?.logoUrl || product?.logo?.url || '';
  if (logoUrl && logoUrl.startsWith('/')) {
    const apiBase = (process.env.API_PUBLIC_URL || process.env.FRONTEND_URL || 'http://localhost:5000').replace(/\/$/, '');
    logoUrl = `${apiBase}${logoUrl}`;
  }

  const brandColor = theme?.primaryColor || '#7B3FA8';
  const bannerColor = emailSettings.bannerColor || theme?.secondaryColor || '#22c55e';
  const footerBg = theme?.footerBg || brandColor;
  const footer = await Section.findOne({ name: 'footer' }).lean();
  const copyright =
    footer?.content?.copyright || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`;

  return {
    brandName,
    brandColor,
    bannerColor,
    footerBg,
    logoUrl,
    websiteUrl,
    copyright,
    emailSettings,
  };
}

module.exports = getEmailBrandContext;
