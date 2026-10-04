import nodemailer from "nodemailer";

/** Email the team; silently skipped when SMTP is not configured. */
export async function sendEmail(subject: string, html: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
    console.warn("Email skipped: SMTP not configured");
    return;
  }
  const port = Number(SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transporter.sendMail({
    from: `"SiliconMotives" <${SMTP_USER}>`,
    to: ADMIN_EMAIL,
    subject,
    html,
  });
}

/** WhatsApp Business API alert; skipped when not configured. */
export async function sendWhatsApp(body: string) {
  const { WHATSAPP_API_URL, WHATSAPP_API_TOKEN, WHATSAPP_ADMIN_NUMBER } = process.env;
  if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN || !WHATSAPP_ADMIN_NUMBER) return;
  const res = await fetch(WHATSAPP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: WHATSAPP_ADMIN_NUMBER,
      type: "text",
      text: { body },
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`WhatsApp API responded ${res.status}`);
}
