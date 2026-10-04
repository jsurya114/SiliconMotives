const mongoose = require("mongoose");

/**
 * SeoSettings — Singleton document for SEO meta data.
 */
const seoSettingsSchema = new mongoose.Schema(
  {
    titleTemplate: {
      type: String,
      default: "%s | SiliconMotives",
    },
    defaultTitle: {
      type: String,
      default: "SiliconMotives Technology",
    },
    defaultDescription: {
      type: String,
      default: "SiliconMotives is a remote-first engineering company in Kerala, building CRM, ERP, e-commerce, and websites with cloud deployment.",
    },
    defaultKeywords: {
      type: String,
      default: "web design Kochi, web development Kerala",
    },
    siteName: {
      type: String,
      default: "SiliconMotives Technology",
    },
    canonicalUrl: {
      type: String,
      default: "",
    },
    googleSiteVerification: {
      type: String,
      default: "",
    },
    ogImage: {
      type: String,
      default: "/opengraph-image",
    },
  },
  {
    timestamps: true,
  }
);

seoSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("SeoSettings", seoSettingsSchema);
