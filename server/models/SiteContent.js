const mongoose = require("mongoose");

/**
 * SiteContent — Singleton document storing all single-instance editable sections.
 * Uses findOneAndUpdate with upsert to ensure only one document ever exists.
 */
const siteContentSchema = new mongoose.Schema(
  {
    // ── Hero Section ──
    hero: {
      headline: { type: String, default: "Define Your" },
      highlightedText: { type: String, default: "Digital Space" },
      subheading: {
        type: String,
        default:
          "We build immersive digital experiences that elevate your brand and drive real results.",
      },
      ctaText: { type: String, default: "Get a Quote" },
      backgroundImage: { type: String, default: null }, // Cloudinary URL or null for default
    },

    // ── FunFact Section ──
    funFact: {
      title: { type: String, default: "Our fun fact" },
      description: {
        type: String,
        default:
          "Each time we fix a particularly tricky bug, we give it a name and create a virtual 'Bug Wall of Fame'. It's our way of celebrating overcoming challenges and learning from our mistakes.",
      },
      stats: {
        type: [
          {
            number: { type: String, required: true },
            label: { type: String, required: true },
          },
        ],
        default: [],
      },
    },

    // ── About Section ──
    about: {
      eyebrow: { type: String, default: "About Us" },
      headline: { type: String, default: "Rooted in Kerala. Not limited by it." },
      paragraphs: {
        type: [String],
        default: [
          "SiliconMotives is a remote-first engineering company based in Kerala, India, led by Jasil M, Founder, and Jayasoorya S, Co-founder.",
          "We build CRM and ERP systems, e-commerce stores, Shopify and WordPress websites, and custom web applications, from development to cloud deployment.",
          "Our lean, remote-first model keeps our focus on people, engineering quality, clear communication, and accountability.",
        ],
      },
      founders: {
        type: [
          {
            name: { type: String, required: true },
            title: { type: String, required: true },
            initials: { type: String, required: true },
          },
        ],
        default: [
          {
            name: "Jasil M",
            title: "Founder",
            initials: "JM",
          },
          {
            name: "Jayasoorya S",
            title: "Co-founder",
            initials: "JS",
          },
        ],
      },
      stats: {
        type: [
          {
            value: { type: String, required: true },
            label: { type: String, required: true },
          },
        ],
        default: [],
      },
    },

    // ── Contact Info ──
    contactInfo: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      whatsappNumber: { type: String, default: "" },
      whatsappMessage: {
        type: String,
        default:
          "Hi SiliconMotives, I'm interested in your web design services.",
      },
      address: {
        line1: { type: String, default: "Remote-first team" },
        line2: { type: String, default: "Kerala" },
        line3: { type: String, default: "India" },
      },
      businessHours: {
        weekday: { type: String, default: "Mon–Fri 9am–6pm" },
        saturday: { type: String, default: "Sat 10am–2pm" },
      },
    },

    // ── Footer ──
    footer: {
      tagline: {
        type: String,
        default:
          "Remote-first engineering. Based in Kerala. Built for everywhere.",
      },
      socialLinks: {
        facebook: {
          type: String,
          default: "",
        },
        instagram: {
          type: String,
          default: "",
        },
        linkedin: {
          type: String,
          default: "",
        },
        twitter: {
          type: String,
          default: "",
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Static method to get or create the singleton document.
 */
siteContentSchema.statics.getContent = async function () {
  let content = await this.findOne();
  if (!content) {
    content = await this.create({});
  }
  return content;
};

/**
 * Static method to update a specific section.
 * Uses findOneAndUpdate with upsert to ensure singleton behavior.
 */
siteContentSchema.statics.updateSection = async function (section, data) {
  const update = {};
  update[section] = data;
  return this.findOneAndUpdate(
    {},
    { $set: update },
    { new: true, upsert: true, runValidators: true }
  );
};

module.exports = mongoose.model("SiteContent", siteContentSchema);
