const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const FONT =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const COLOR_TEXT = '#444444';
const COLOR_HEADING = '#000000';
const COLOR_MUTED = '#999999';
const COLOR_BORDER = '#e5e5e5';
const COLOR_CTA = '#000000';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emailShell({ brandName, logoUrl, bodyHtml, copyright, websiteUrl, showSocial = false, useLogoImage = false }) {
  const logoBlock =
    useLogoImage && logoUrl
      ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(brandName)}" width="96" style="display:block;max-width:96px;height:auto;" />`
      : `<div style="font-family:${FONT};font-size:14px;font-weight:500;color:${COLOR_HEADING};letter-spacing:3px;text-transform:uppercase;">${escapeHtml(brandName)}</div>`;

  const socialLinks = showSocial
    ? `<p style="margin:12px 0 0;font-size:12px;color:${COLOR_MUTED};line-height:1.6;">
        <a href="${escapeHtml(websiteUrl)}" style="color:${COLOR_MUTED};text-decoration:underline;">Visit store</a>
        &nbsp;·&nbsp;
        <a href="${escapeHtml(websiteUrl)}/track-order" style="color:${COLOR_MUTED};text-decoration:underline;">Track order</a>
      </p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(brandName)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:${FONT};-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;">
          <tr>
            <td style="padding:32px 40px 24px;background-color:#ffffff;border-bottom:1px solid ${COLOR_BORDER};">
              ${logoBlock}
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:40px 40px 48px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 32px;background-color:#ffffff;border-top:1px solid ${COLOR_BORDER};">
              <p style="margin:0;font-size:12px;color:${COLOR_MUTED};line-height:1.7;">${escapeHtml(copyright)}</p>
              <p style="margin:10px 0 0;font-size:12px;color:${COLOR_MUTED};line-height:1.7;">
                <a href="${escapeHtml(websiteUrl)}/account" style="color:${COLOR_MUTED};text-decoration:underline;">Manage preferences</a>
                &nbsp;·&nbsp;
                <a href="${escapeHtml(websiteUrl)}/account" style="color:${COLOR_MUTED};text-decoration:underline;">Unsubscribe</a>
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

function ctaButton({ href, text }) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:32px auto 0;">
    <tr>
      <td align="center" style="border-radius:2px;background-color:${COLOR_CTA};">
        <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:12px 32px;font-family:${FONT};font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;border-radius:2px;">${escapeHtml(text)}</a>
      </td>
    </tr>
  </table>`;
}

function bodyText(html) {
  return `<p style="margin:0 0 16px;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};line-height:1.7;">${html}</p>`;
}

function heading(text) {
  return `<h1 style="margin:0 0 24px;font-family:${FONT};font-size:22px;font-weight:500;color:${COLOR_HEADING};line-height:1.35;letter-spacing:-0.01em;">${text}</h1>`;
}

function subheading(text) {
  return `<h2 style="margin:32px 0 12px;font-family:${FONT};font-size:14px;font-weight:500;color:${COLOR_HEADING};line-height:1.4;letter-spacing:0.02em;text-transform:uppercase;">${text}</h2>`;
}

function welcomeEmailTemplate({
  name,
  brandName,
  logoUrl,
  websiteUrl,
  copyright,
  ctaText = 'Shop Now',
  bodyContent,
}) {
  const defaultParagraphs = [
    `Thank you for joining ${escapeHtml(brandName)}. We're glad to have you.`,
    'You can now track orders, save your address, and shop whenever you are ready.',
  ];

  const paragraphs = bodyContent
    ? bodyContent.split(/\n\n+/).filter(Boolean)
    : defaultParagraphs;

  const bodyHtml = `
    ${heading('Welcome')}
    ${bodyText(`Hi ${escapeHtml(name)},`)}
    ${paragraphs.map((p) => bodyText(escapeHtml(p))).join('')}
    ${ctaButton({ href: websiteUrl, text: ctaText })}
  `;

  return emailShell({
    brandName,
    logoUrl,
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
  logoUrl,
  trackOrderUrl,
  websiteUrl,
  copyright,
  ctaText = 'Track Your Order',
}) {
  const itemRows = items
    .map(
      (item) => `<tr>
        <td style="padding:12px 0;border-bottom:1px solid ${COLOR_BORDER};font-family:${FONT};font-size:14px;color:${COLOR_TEXT};line-height:1.5;">${escapeHtml(item.name)}${item.packLabel ? ` <span style="color:${COLOR_MUTED};">(${escapeHtml(item.packLabel)})</span>` : ''}</td>
        <td align="center" style="padding:12px 8px;border-bottom:1px solid ${COLOR_BORDER};font-family:${FONT};font-size:14px;color:${COLOR_TEXT};">${escapeHtml(item.quantity)}</td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid ${COLOR_BORDER};font-family:${FONT};font-size:14px;color:${COLOR_TEXT};">${fmt(item.price * item.quantity)}</td>
      </tr>`
    )
    .join('');

  const shippingText = shipping === 0 || shipping === 'FREE' ? 'Free' : fmt(shipping);
  const discountRow =
    discount > 0
      ? `<tr>
          <td style="padding:8px 0;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};">Discount</td>
          <td align="right" style="padding:8px 0;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};">-${fmt(discount)}</td>
        </tr>`
      : '';

  const bodyHtml = `
    ${heading('Order confirmed')}
    ${bodyText(`Hi ${escapeHtml(name)},`)}
    ${bodyText('Thank you for your order. A summary is below.')}
    <p style="margin:0 0 24px;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};line-height:1.7;">
      <span style="color:${COLOR_HEADING};font-weight:500;">Order #${escapeHtml(orderId)}</span>
      <span style="color:${COLOR_MUTED};"> · ${escapeHtml(date)}</span>
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;border-collapse:collapse;">
      <tr>
        <th align="left" style="padding:0 0 12px;font-family:${FONT};font-size:12px;font-weight:500;color:${COLOR_MUTED};border-bottom:1px solid ${COLOR_BORDER};text-transform:uppercase;letter-spacing:0.06em;">Product</th>
        <th align="center" style="padding:0 8px 12px;font-family:${FONT};font-size:12px;font-weight:500;color:${COLOR_MUTED};border-bottom:1px solid ${COLOR_BORDER};text-transform:uppercase;letter-spacing:0.06em;">Qty</th>
        <th align="right" style="padding:0 0 12px;font-family:${FONT};font-size:12px;font-weight:500;color:${COLOR_MUTED};border-bottom:1px solid ${COLOR_BORDER};text-transform:uppercase;letter-spacing:0.06em;">Price</th>
      </tr>
      ${itemRows}
    </table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:32px;">
      <tr><td style="padding:8px 0;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};">Subtotal</td><td align="right" style="padding:8px 0;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};">${fmt(subtotal)}</td></tr>
      <tr><td style="padding:8px 0;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};">Shipping</td><td align="right" style="padding:8px 0;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};">${shippingText}</td></tr>
      ${discountRow}
      <tr><td style="padding:16px 0 8px;font-family:${FONT};font-size:14px;font-weight:500;color:${COLOR_HEADING};border-top:1px solid ${COLOR_BORDER};">Total</td><td align="right" style="padding:16px 0 8px;font-family:${FONT};font-size:14px;font-weight:500;color:${COLOR_HEADING};border-top:1px solid ${COLOR_BORDER};">${fmt(total)}</td></tr>
      <tr><td style="padding:8px 0;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};">Payment</td><td align="right" style="padding:8px 0;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};">${escapeHtml(paymentMethod)}</td></tr>
    </table>
    ${subheading('Shipping address')}
    <p style="margin:0;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};line-height:1.7;">
      ${escapeHtml(address.name || '')}<br />
      ${address.phone ? `${escapeHtml(address.phone)}<br />` : ''}
      ${escapeHtml([address.address, address.city, address.pincode].filter(Boolean).join(', '))}
    </p>
    ${bodyText('Your order is being processed and will ship soon.')}
    ${ctaButton({ href: trackOrderUrl, text: ctaText })}
  `;

  return emailShell({
    brandName,
    logoUrl,
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
  logoUrl,
  checkoutUrl,
  websiteUrl,
  copyright,
  stockLeft,
  urgencyText,
  ctaText = 'Complete purchase',
  bodyContent,
}) {
  const urgency = (urgencyText || '').replace(/X/g, String(stockLeft ?? 'a few'));

  const itemRows = cartItems
    .map(
      (item) => `<tr>
        <td style="padding:16px 0;border-bottom:1px solid ${COLOR_BORDER};vertical-align:top;">
          <p style="margin:0 0 4px;font-family:${FONT};font-size:14px;font-weight:500;color:${COLOR_HEADING};line-height:1.4;">${escapeHtml(item.name)}</p>
          ${item.packLabel ? `<p style="margin:0 0 4px;font-family:${FONT};font-size:13px;color:${COLOR_MUTED};line-height:1.5;">${escapeHtml(item.packLabel)}</p>` : ''}
          <p style="margin:0;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};line-height:1.5;">${fmt(item.price)} × ${escapeHtml(item.quantity)}</p>
        </td>
      </tr>`
    )
    .join('');

  const introParagraphs = bodyContent
    ? bodyContent.split(/\n\n+/).filter(Boolean).map((p) => bodyText(escapeHtml(p))).join('')
    : `${bodyText(`Hi ${escapeHtml(name)},`)}${bodyText('You left a few items in your cart. They are still reserved for you when you are ready to checkout.')}`;

  const bodyHtml = `
    ${heading('Your cart is waiting')}
    ${introParagraphs}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 24px;border-collapse:collapse;">
      ${itemRows}
    </table>
    ${urgency ? bodyText(escapeHtml(urgency)) : ''}
    ${ctaButton({ href: checkoutUrl, text: ctaText })}
    <p style="margin:24px 0 0;font-family:${FONT};font-size:12px;color:${COLOR_MUTED};line-height:1.7;text-align:center;">If you no longer wish to purchase, you can ignore this email.</p>
  `;

  return emailShell({
    brandName,
    logoUrl,
    bodyHtml,
    copyright,
    websiteUrl: websiteUrl || checkoutUrl?.replace(/\/checkout.*$/, '') || '',
    showSocial: false,
  });
}

function digitalProductPurchaseTemplate({
  brandName,
  logoUrl,
  copyright,
  websiteUrl,
  customerName,
  productTitle,
  fileName,
  fileType,
  price,
  downloadUrl,
  orderId,
}) {
  const bodyHtml = `
    ${heading('Your download is ready')}
    ${bodyText(`Hi ${escapeHtml(customerName)},`)}
    ${bodyText('Thank you for your purchase. Your digital product is ready to download.')}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 24px;border-collapse:collapse;">
      <tr>
        <td style="padding:20px 0;border-top:1px solid ${COLOR_BORDER};border-bottom:1px solid ${COLOR_BORDER};">
          <p style="margin:0 0 8px;font-family:${FONT};font-size:12px;color:${COLOR_MUTED};letter-spacing:0.08em;text-transform:uppercase;">Order #${escapeHtml(orderId)}</p>
          <p style="margin:0 0 6px;font-family:${FONT};font-size:14px;font-weight:500;color:${COLOR_HEADING};line-height:1.4;">${escapeHtml(productTitle)}</p>
          <p style="margin:0 0 6px;font-family:${FONT};font-size:14px;color:${COLOR_TEXT};line-height:1.7;">${escapeHtml(fileName || productTitle)} · ${escapeHtml((fileType || 'file').toUpperCase())}</p>
          <p style="margin:0;font-family:${FONT};font-size:14px;color:${COLOR_HEADING};line-height:1.7;">${fmt(price)}</p>
        </td>
      </tr>
    </table>
    ${ctaButton({ href: downloadUrl, text: 'Download file' })}
    <p style="margin:24px 0 0;font-family:${FONT};font-size:12px;color:${COLOR_MUTED};line-height:1.7;text-align:center;">
      If the button does not work, copy this link into your browser:<br />
      <a href="${escapeHtml(downloadUrl)}" style="color:${COLOR_TEXT};word-break:break-all;text-decoration:underline;">${escapeHtml(downloadUrl)}</a>
    </p>
  `;

  return emailShell({
    brandName,
    logoUrl,
    bodyHtml,
    copyright,
    websiteUrl,
    showSocial: false,
  });
}

module.exports = {
  welcomeEmailTemplate,
  orderConfirmationTemplate,
  abandonedCartTemplate,
  digitalProductPurchaseTemplate,
  fmt,
};
