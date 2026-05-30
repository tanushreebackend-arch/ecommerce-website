const Settings = require('../models/Settings');

const EMAIL_SETTINGS_KEY = 'emailSettings';

const DEFAULT_EMAIL_SETTINGS = {
  welcomeEnabled: true,
  orderConfirmationEnabled: true,
  abandonedCartEnabled: true,
  abandonedCartDelayHours: 1.5,
  abandonedCartUrgencyText: 'Only a few units left in stock.',
  welcomeCtaText: 'Shop now',
  orderCtaText: 'Track your order',
  abandonedCartCtaText: 'Complete purchase',
  bannerColor: '',
};

async function getEmailSettings() {
  const doc = await Settings.findOne({ key: EMAIL_SETTINGS_KEY });
  return { ...DEFAULT_EMAIL_SETTINGS, ...(doc?.value || {}) };
}

async function saveEmailSettings(value) {
  const merged = { ...DEFAULT_EMAIL_SETTINGS, ...value };
  await Settings.findOneAndUpdate(
    { key: EMAIL_SETTINGS_KEY },
    { value: merged },
    { upsert: true }
  );
  return merged;
}

module.exports = { EMAIL_SETTINGS_KEY, DEFAULT_EMAIL_SETTINGS, getEmailSettings, saveEmailSettings };
