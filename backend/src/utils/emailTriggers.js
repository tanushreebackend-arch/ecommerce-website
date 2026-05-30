const getEmailBrandContext = require('./getEmailBrandContext');
const { sendEmail } = require('./sendEmail');
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
  if (!ctx.emailSettings.welcomeEnabled) return { skipped: true };

  const name = user.firstName || user.name || 'there';
  const html = welcomeEmailTemplate({
    name,
    brandName: ctx.brandName,
    logoUrl: ctx.logoUrl,
    websiteUrl: ctx.websiteUrl,
    copyright: ctx.copyright,
    ctaText: ctx.emailSettings.welcomeCtaText,
  });

  return sendEmail({
    to: user.email,
    subject: `Welcome to ${ctx.brandName}`,
    html,
  });
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
    brandName: ctx.brandName,
    logoUrl: ctx.logoUrl,
    trackOrderUrl: `${ctx.websiteUrl}/track-order`,
    websiteUrl: ctx.websiteUrl,
    copyright: ctx.copyright,
    ctaText: ctx.emailSettings.orderCtaText,
  });

  const email = order.customerEmail;
  if (!email) return { skipped: true };

  return sendEmail({
    to: email,
    subject: `${ctx.brandName} — Order confirmed #${order.orderId || order._id}`,
    html,
  });
}

async function sendAbandonedCartEmail(user, cartItems, stockLeft = 5) {
  const ctx = await getEmailBrandContext();
  if (!ctx.emailSettings.abandonedCartEnabled) return { skipped: true };

  const name = user.firstName || user.name || 'there';
  const html = abandonedCartTemplate({
    name,
    cartItems,
    brandName: ctx.brandName,
    logoUrl: ctx.logoUrl,
    checkoutUrl: `${ctx.websiteUrl}/checkout`,
    websiteUrl: ctx.websiteUrl,
    copyright: ctx.copyright,
    stockLeft,
    urgencyText: ctx.emailSettings.abandonedCartUrgencyText,
    ctaText: ctx.emailSettings.abandonedCartCtaText,
  });

  return sendEmail({
    to: user.email,
    subject: `${name}, your cart is waiting`,
    html,
  });
}

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendAbandonedCartEmail,
  formatPaymentMethod,
};
