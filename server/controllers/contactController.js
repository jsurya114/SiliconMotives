const ContactSubmission = require("../models/ContactSubmission");
const sendEmail = require("../utils/sendEmail");
const sendWhatsApp = require("../utils/sendWhatsApp");

/**
 * POST /api/contact
 * Public: Submit a contact form (rate-limited).
 * Saves to DB, sends email notification, sends WhatsApp alert.
 */
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Save to database
    const submission = await ContactSubmission.create({
      name,
      email,
      phone,
      service,
      message,
    });

    // Send email notification (non-blocking — don't fail the request if email fails)
    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact from ${name} — SiliconMotives.in`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Service:</strong> ${service || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr/>
        <p style="color: #888; font-size: 12px;">Submitted at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      `,
    }).catch((err) => console.error("Email notification failed:", err.message));

    // Send WhatsApp alert (non-blocking)
    sendWhatsApp(
      `📩 New Contact: ${name}\n📧 ${email}\n📱 ${phone || "N/A"}\n💼 ${service || "N/A"}\n\n${message.substring(0, 200)}`
    ).catch((err) => console.error("WhatsApp notification failed:", err.message));

    res.status(201).json({
      success: true,
      message: "Thank you! We'll get back to you within 24 hours.",
      data: { id: submission._id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/contact
 * Admin: Get all contact submissions with pagination.
 */
exports.getSubmissions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.isRead !== undefined) {
      filter.isRead = req.query.isRead === "true";
    }

    const [submissions, total] = await Promise.all([
      ContactSubmission.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ContactSubmission.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/contact/:id/read
 * Admin: Mark a submission as read/unread.
 */
exports.toggleRead = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    submission.isRead = !submission.isRead;
    await submission.save();

    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/contact/:id
 * Admin: Delete a submission.
 */
exports.deleteSubmission = async (req, res, next) => {
  try {
    const submission = await ContactSubmission.findByIdAndDelete(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }
    res.status(200).json({ success: true, message: "Submission deleted" });
  } catch (error) {
    next(error);
  }
};
