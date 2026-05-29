const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emailShell({
  brandName,
  brandColor,
  bannerColor,
  footerBg,
  logoUrl,
  bannerText,
  bodyHtml,
  copyright,
  websiteUrl,
  showSocial = true,
}) {
  const logoBlock = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(brandName)}" width="120" style="display:block;max-width:120px;height:auto;margin:0 auto 8px;" />`
    : `<div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:1px;">${escapeHtml(brandName)}</div>`;

  const socialLinks = showSocial
    ? `<p style="margin:12px 0 0;font-size:12px;color:#ffffff;">
        <a href="${escapeHtml(websiteUrl)}" style="color:#ffffff;text-decoration:underline;">Visit Store</a>
        &nbsp;·&nbsp;
        <a href="${escapeHtml(websiteUrl)}/track-order" style="color:#ffffff;text-decoration:underline;">Track Order</a>
      </p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(brandName)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="background-color:${escapeHtml(brandColor)};padding:28px 24px;border-radius:12px 12px 0 0;">
              ${logoBlock}
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color:${escapeHtml(bannerColor)};padding:16px 24px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">${escapeHtml(bannerText)}</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:32px 28px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color:${escapeHtml(footerBg)};padding:24px;border-radius:0 0 12px 12px;">
              <p style="margin:0;font-size:12px;color:#ffffff;line-height:1.6;">${escapeHtml(copyright)}</p>
              <p style="margin:8px 0 0;font-size:11px;color:#ffffff;">
                <a href="${escapeHtml(websiteUrl)}/account" style="color:#ffffff;text-decoration:underline;">Manage preferences</a>
              </p>
              ${socialLinks}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton({ href, text, brandColor }) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px auto 0;">
    <tr>
      <td align="center" style="border-radius:8px;background-color:${escapeHtml(brandColor)};">
        <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">${escapeHtml(text)}</a>
      </td>
    </tr>
  </table>`;
}

function welcomeEmailTemplate({
  name,
  brandName,
  brandColor,
  bannerColor,
  footerBg,
  logoUrl,
  websiteUrl,
  copyright,
  ctaText = 'Shop Now',
}) {
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 16px;font-size:15px;color:#4b5563;line-height:1.6;">
      Thank you for joining <strong style="color:${escapeHtml(brandColor)};">${escapeHtml(brandName)}</strong>.
      We're excited to have you!
    </p>
    <p style="margin:0 0 8px;font-size:15px;color:#4b5563;line-height:1.6;">
      You can now track your orders, save your address, and enjoy exclusive member offers.
    </p>
    ${ctaButton({ href: websiteUrl, text: ctaText, brandColor })}
  `;

  return emailShell({
    brandName,
    brandColor,
    bannerColor,
    footerBg,
    logoUrl,
    bannerText: 'Welcome to the family!',
    bodyHtml,
    copyright,
    websiteUrl,
    showSocial: false,
  });
}

function orderConfirmationTemplate({
  name,
  orderId,
  date,
  items = [],
  subtotal,
  shipping,
  discount = 0,
  total,
  paymentMethod,
  address = {},
  brandName,
  brandColor,
  bannerColor,
  footerBg,
  logoUrl,
  trackOrderUrl,
  websiteUrl,
  copyright,
  ctaText = 'Track Your Order',
}) {
  const itemRows = items
    .map(
      (item) => `<tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;">${escapeHtml(item.name)}${item.packLabel ? ` <span style="color:#6b7280;">(${escapeHtml(item.packLabel)})</span>` : ''}</td>
        <td align="center" style="padding:10px 8px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;">${escapeHtml(item.quantity)}</td>
        <td align="right" style="padding:10px 8px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;">${fmt(item.price * item.quantity)}</td>
      </tr>`
    )
    .join('');

  const shippingText = shipping === 0 || shipping === 'FREE' ? 'FREE' : fmt(shipping);
  const discountRow =
    discount > 0
      ? `<tr>
          <td style="padding:8px 0;font-size:14px;color:#374151;">Discount</td>
          <td align="right" style="padding:8px 0;font-size:14px;color:#16a34a;">-${fmt(discount)}</td>
        </tr>`
      : '';

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.6;">Thanks for your order. Here are your order details:</p>
    <p style="margin:0 0 20px;font-size:15px;font-weight:700;color:${escapeHtml(brandColor)};">
      Order #${escapeHtml(orderId)} <span style="font-weight:400;color:#6b7280;">(${escapeHtml(date)})</span>
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;border-collapse:collapse;">
      <tr style="background-color:#f9fafb;">
        <th align="left" style="padding:10px 8px;font-size:13px;color:${escapeHtml(brandColor)};border-bottom:2px solid ${escapeHtml(brandColor)};">Product</th>
        <th align="center" style="padding:10px 8px;font-size:13px;color:${escapeHtml(brandColor)};border-bottom:2px solid ${escapeHtml(brandColor)};">Quantity</th>
        <th align="right" style="padding:10px 8px;font-size:13px;color:${escapeHtml(brandColor)};border-bottom:2px solid ${escapeHtml(brandColor)};">Price</th>
      </tr>
      ${itemRows}
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
      <tr><td style="padding:8px 0;font-size:14px;color:#374151;">Subtotal</td><td align="right" style="padding:8px 0;font-size:14px;color:#374151;">${fmt(subtotal)}</td></tr>
      <tr><td style="padding:8px 0;font-size:14px;color:#374151;">Shipping</td><td align="right" style="padding:8px 0;font-size:14px;color:#374151;">${shippingText}</td></tr>
      ${discountRow}
      <tr><td style="padding:12px 0 8px;font-size:16px;font-weight:700;color:${escapeHtml(brandColor)};">Total</td><td align="right" style="padding:12px 0 8px;font-size:16px;font-weight:700;color:${escapeHtml(brandColor)};">${fmt(total)}</td></tr>
      <tr><td style="padding:8px 0;font-size:14px;color:#374151;">Payment method</td><td align="right" style="padding:8px 0;font-size:14px;color:#374151;">${escapeHtml(paymentMethod)}</td></tr>
    </table>
    <h3 style="margin:0 0 12px;font-size:16px;color:${escapeHtml(brandColor)};">Billing Address</h3>
    <p style="margin:0;font-size:14px;color:#4b5563;line-height:1.7;">
      ${escapeHtml(address.name || '')}<br />
      ${address.phone ? `${escapeHtml(address.phone)}<br />` : ''}
      ${escapeHtml([address.address, address.city, address.pincode].filter(Boolean).join(', '))}
    </p>
    <p style="margin:24px 0 0;font-size:14px;color:#4b5563;line-height:1.6;">Your order is being processed and will be shipped soon.</p>
    ${ctaButton({ href: trackOrderUrl, text: ctaText, brandColor })}
  `;

  return emailShell({
    brandName,
    brandColor,
    bannerColor,
    footerBg,
    logoUrl,
    bannerText: 'Thank you for your order',
    bodyHtml,
    copyright,
    websiteUrl: websiteUrl || trackOrderUrl?.replace(/\/track-order.*$/, '') || '',
    showSocial: true,
  });
}

function abandonedCartTemplate({
  name,
  cartItems = [],
  brandName,
  brandColor,
  bannerColor,
  footerBg,
  logoUrl,
  checkoutUrl,
  websiteUrl,
  copyright,
  stockLeft,
  urgencyText,
  ctaText = 'Complete My Purchase →',
}) {
  const urgency = (urgencyText || '').replace(/X/g, String(stockLeft ?? 'a few'));

  const itemCards = cartItems
    .map(
      (item) => `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:16px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <tr>
          <td width="80" style="padding:12px;vertical-align:middle;">
            ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" width="64" height="64" style="display:block;width:64px;height:64px;object-fit:cover;border-radius:6px;" />` : ''}
          </td>
          <td style="padding:12px 12px 12px 0;vertical-align:middle;">
            <p style="margin:0 0 4px;font-size:15px;font-weight:700;color:${escapeHtml(brandColor)};">${escapeHtml(item.name)}</p>
            ${item.packLabel ? `<p style="margin:0 0 4px;font-size:13px;color:#6b7280;">${escapeHtml(item.packLabel)}</p>` : ''}
            <p style="margin:0;font-size:14px;color:#374151;">${fmt(item.price)} × ${escapeHtml(item.quantity)}</p>
          </td>
        </tr>
      </table>`
    )
    .join('');

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:16px;color:#374151;">Hi ${escapeHtml(name)},</p>
    <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.6;">
      It looks like you left something in your cart. Don't let it slip away — your item is waiting for you!
    </p>
    ${itemCards}
    <p style="margin:0 0 20px;font-size:14px;color:#374151;font-weight:600;">${escapeHtml(urgency)}</p>
    ${ctaButton({ href: checkoutUrl, text: ctaText, brandColor })}
    <p style="margin:24px 0 0;font-size:13px;color:#6b7280;text-align:center;">Or if you've changed your mind, no worries at all 😊</p>
  `;

  return emailShell({
    brandName,
    brandColor,
    bannerColor,
    footerBg,
    logoUrl,
    bannerText: 'Your cart misses you! 😢',
    bodyHtml,
    copyright,
    websiteUrl: websiteUrl || checkoutUrl?.replace(/\/checkout.*$/, '') || '',
    showSocial: false,
  });
}

module.exports = {
  welcomeEmailTemplate,
  orderConfirmationTemplate,
  abandonedCartTemplate,
  fmt,
};
