const getEmailBrandContext = require('./getEmailBrandContext');
const { sendEmail } = require('./sendEmail');
const { applyEmailVars } = require('./emailVars');
const {
  welcomeEmailTemplate,
  orderConfirmationTemplate,
  abandonedCartTemplate,
} = require('./emailTemplates');

function formatPaymentMethod(method) {
  const map = {
    razorpay: 'Card / UPI',
    upi: 'UPI',
    cod: 'Cash on Delivery',
    card: 'Card',
  };
  return map[String(method || '').toLowerCase()] || method || 'Online';
}

async function sendWelcomeEmail(user) {
  const ctx = await getEmailBrandContext();
  if (!ctx.emailSettings.welcomeEnabled) {
    console.log('[email] Welcome email skipped — disabled in settings');
    return { skipped: true };
  }

  const name = user.firstName || user.name || 'there';
  const vars = { storeName: ctx.storeName, name };
  const html = welcomeEmailTemplate({
    name,
    brandName: ctx.storeName,
    logoUrl: ctx.logoUrl,
    websiteUrl: ctx.websiteUrl,
    copyright: ctx.copyright,
    ctaText: ctx.emailSettings.welcomeCtaText,
    bodyContent: applyEmailVars(ctx.emailSettings.welcomeBodyText, vars),
  });

  const subject = applyEmailVars(
    ctx.emailSettings.welcomeSubject || 'Welcome to {storeName}',
    vars
  );

  const result = await sendEmail({
    to: user.email,
    subject,
    html,
  });

  if (result?.skipped) {
    console.log('[email] Welcome email skipped — email transporter not configured');
  }

  return result;
}

async function sendOrderConfirmationEmail(order) {
  const ctx = await getEmailBrandContext();
  if (!ctx.emailSettings.orderConfirmationEnabled) return { skipped: true };

  const addr = order.shippingAddress || {};
  const customerName =
    order.customerName ||
    `${addr.firstName || ''} ${addr.lastName || ''}`.trim() ||
    'Customer';
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const html = orderConfirmationTemplate({
    name: customerName,
    orderId: order.orderId || order._id,
    date: orderDate,
    items: (order.items || []).map((item) => ({
      name: item.name,
      packLabel: item.packLabel || item.pack,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal ?? order.total,
    shipping: order.shippingCost ?? 0,
    discount: order.discount ?? 0,
    total: order.total,
    paymentMethod: formatPaymentMethod(order.paymentMethod),
    address: {
      name: customerName,
      phone: addr.phone || order.customerPhone,
      address: [addr.address, addr.apartment].filter(Boolean).join(', '),
      city: addr.city,
      pincode: addr.pinCode,
    },
    brandName: ctx.storeName,
    logoUrl: ctx.logoUrl,
    trackOrderUrl: `${ctx.websiteUrl}/track-order`,
    websiteUrl: ctx.websiteUrl,
    copyright: ctx.copyright,
    ctaText: ctx.emailSettings.orderCtaText,
  });

  const email = order.customerEmail;
  if (!email) return { skipped: true };

  const orderId = order.orderId || order._id;
  const subjectBase = applyEmailVars(
    ctx.emailSettings.orderConfirmationSubject || 'Order Confirmed',
    { storeName: ctx.storeName }
  );
  const subject = `${subjectBase} #${orderId}`;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

async function sendAbandonedCartEmail(user, cartItems, stockLeft = 5) {
  const ctx = await getEmailBrandContext();
  if (!ctx.emailSettings.abandonedCartEnabled) return { skipped: true };

  const name = user.firstName || user.name || 'there';
  const vars = { storeName: ctx.storeName, name, productName: ctx.productName };
  const html = abandonedCartTemplate({
    name,
    cartItems,
    brandName: ctx.storeName,
    logoUrl: ctx.logoUrl,
    checkoutUrl: `${ctx.websiteUrl}/checkout`,
    websiteUrl: ctx.websiteUrl,
    copyright: ctx.copyright,
    stockLeft,
    urgencyText: ctx.emailSettings.abandonedCartUrgencyText,
    ctaText: ctx.emailSettings.abandonedCartCtaText,
    bodyContent: applyEmailVars(ctx.emailSettings.abandonedCartBodyText, vars),
  });

  const subject = applyEmailVars(
    ctx.emailSettings.abandonedCartSubject || 'You left something behind',
    vars
  );

  return sendEmail({
    to: user.email,
    subject,
    html,
  });
}

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendAbandonedCartEmail,
  formatPaymentMethod,
};
