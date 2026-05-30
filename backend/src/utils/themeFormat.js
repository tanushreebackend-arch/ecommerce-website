const THEME_DEFAULTS = {
  buttonColor: '#000000',
  accentColor: '#000000',
  navbarColor: '#000000',
  announcementBg: '#000000',
  announcementText: '#ffffff',
};

function contrastText(bg) {
  const hex = String(bg || '').replace('#', '');
  if (hex.length !== 6) return '#ffffff';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000000' : '#ffffff';
}

/** Normalize DB theme document to frontend/admin field names */
function formatTheme(theme) {
  if (!theme) return { ...THEME_DEFAULTS };

  const doc = typeof theme.toObject === 'function' ? theme.toObject() : theme;

  const buttonColor = doc.primaryColor || doc.buttonColor || THEME_DEFAULTS.buttonColor;
  const accentColor = doc.secondaryColor || doc.accentColor || THEME_DEFAULTS.accentColor;
  const navbarColor = doc.navbarBg || doc.navbarColor || THEME_DEFAULTS.navbarColor;
  const announcementBg = doc.announcementBg || accentColor;
  const announcementText = doc.announcementText || contrastText(announcementBg);

  return {
    buttonColor,
    accentColor,
    navbarColor,
    announcementBg,
    announcementText,
    headingFont: doc.headingFont || 'Inter',
    bodyFont: doc.bodyFont || 'Inter',
    accentFont: doc.accentFont || doc.bodyFont || 'Inter',
    bgColor: doc.bgColor || '#ffffff',
    textColor: doc.textColor || '#444444',
    headingColor: doc.headingColor || '#000000',
    linkColor: doc.linkColor || '#000000',
    footerBg: doc.footerBg || '#000000',
    sectionAltBg: doc.sectionAltBg || '#ffffff',
    cardBorderColor: doc.cardBorderColor || '#E5E5E5',
    // Legacy keys used by settings bundle
    primaryColor: buttonColor,
    secondaryColor: accentColor,
    navbarBg: navbarColor,
  };
}

module.exports = { formatTheme, THEME_DEFAULTS };
