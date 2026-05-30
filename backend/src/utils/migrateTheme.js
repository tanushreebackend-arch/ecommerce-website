const Theme = require('../models/Theme');

const LEGACY_YELLOW = new Set(['#ffd700', '#ffc107', '#f5a623', '#ffcc00']);

/** One-time migration: replace legacy yellow theme values with black */
async function migrateThemeDefaults() {
  try {
    const theme = await Theme.findOne();
    if (!theme) return;

    let changed = false;

    const normalize = (field) => {
      const value = theme[field];
      if (value && LEGACY_YELLOW.has(String(value).toLowerCase())) {
        theme[field] = '#000000';
        changed = true;
      }
    };

    normalize('secondaryColor');
    normalize('announcementBg');
    normalize('primaryColor');
    normalize('navbarBg');

    if (changed) {
      await theme.save();
      console.log('Theme migration: updated legacy yellow colors to black');
    }
  } catch (error) {
    console.error('Theme migration failed:', error.message);
  }
}

module.exports = migrateThemeDefaults;
