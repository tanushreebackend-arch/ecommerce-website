const cron = require('node-cron');
const User = require('../models/User');
const Product = require('../models/Product');
const { getEmailSettings } = require('../utils/emailSettings');
const { sendAbandonedCartEmail } = require('../utils/emailTriggers');

async function processAbandonedCarts() {
  const settings = await getEmailSettings();
  if (!settings.abandonedCartEnabled) return;

  const delayMs = (settings.abandonedCartDelayHours || 1.5) * 60 * 60 * 1000;
  const cutoff = new Date(Date.now() - delayMs);

  const users = await User.find({
    email: { $exists: true, $ne: '' },
    'savedCart.0': { $exists: true },
    cartAbandonedEmailSent: false,
    cartLastUpdated: { $lte: cutoff },
  }).select('firstName lastName email savedCart');

  if (!users.length) return;

  const product = await Product.findOne().select('stock').lean();
  const stockLeft = product?.stock ?? 5;

  for (const user of users) {
    try {
      await sendAbandonedCartEmail(user, user.savedCart, stockLeft);
      user.cartAbandonedEmailSent = true;
      await user.save();
      console.log(`[cron] Abandoned cart email sent to ${user.email}`);
    } catch (err) {
      console.error(`[cron] Failed abandoned cart email for ${user.email}:`, err.message);
    }
  }
}

function startAbandonedCartCron() {
  cron.schedule('*/30 * * * *', () => {
    processAbandonedCarts().catch((err) => {
      console.error('[cron] Abandoned cart job error:', err.message);
    });
  });
  console.log('[cron] Abandoned cart job scheduled (every 30 minutes)');
}

module.exports = { startAbandonedCartCron, processAbandonedCarts };
