const createTransporter = require("../config/mailer");

/**
 * Send an email notification.
 * Gracefully handles missing SMTP configuration.
 *
 * @param {Object} options - { to, subject, html, text }
 */
const sendEmail = async (options) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn("⚠️  Skipping email — SMTP not configured");
    return null;
  }

  const mailOptions = {
    from: `"SiliconMotives" <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
