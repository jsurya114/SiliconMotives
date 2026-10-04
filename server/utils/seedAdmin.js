/**
 * Seed the initial admin user.
 *
 * Usage: node utils/seedAdmin.js
 * Or:    npm run seed (from /server)
 *
 * Reads SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME from .env
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const AdminUser = require("../models/AdminUser");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const email = process.env.SEED_ADMIN_EMAIL || "admin@siliconmotives.local";
    const password = process.env.SEED_ADMIN_PASSWORD || "admin123";
    const name = process.env.SEED_ADMIN_NAME || "SiliconMotives Admin";

    // Check if admin already exists
    const existing = await AdminUser.findOne({ email });
    if (existing) {
      console.log(`⚠️  Admin already exists: ${email}`);
      console.log("   To reset password, delete the user from MongoDB and re-run this script.");
      process.exit(0);
    }

    const admin = await AdminUser.create({ name, email, password });
    console.log(`\n🎉 Admin user created successfully!`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Password: (as set in .env SEED_ADMIN_PASSWORD)\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
