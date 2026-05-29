const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('[email] EMAIL_USER or EMAIL_PASS not configured — emails will not send');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  return transporter;
}

async function sendEmail({ to, subject, html }) {
  const transport = getTransporter();
  if (!transport) {
    console.warn(`[email] Skipped "${subject}" to ${to} — transporter not configured`);
    return { skipped: true };
  }

  const fromName = process.env.EMAIL_FROM_NAME || 'NOW FOODS';
  const fromEmail = process.env.EMAIL_USER;

  const info = await transport.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
  });

  return info;
}

module.exports = { sendEmail };
