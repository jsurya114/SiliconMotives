require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Route imports
const authRoutes = require("./routes/auth");
const contentRoutes = require("./routes/content");
const serviceRoutes = require("./routes/services");
const portfolioRoutes = require("./routes/portfolio");
const testimonialRoutes = require("./routes/testimonials");
const contactRoutes = require("./routes/contact");
const uploadRoutes = require("./routes/upload");
const seoRoutes = require("./routes/seo");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT;

// ── Connect to MongoDB ──
connectDB();

// ── Global Middleware ──
app.use(helmet()); // Security headers
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(process.env.ADDITIONAL_CLIENT_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies for JWT
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", apiLimiter); // General rate limiting on all API routes

// ── API Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/seo", seoRoutes);

// ── Health Check ──
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SiliconMotives API is running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Error Handler (must be last) ──
app.use(errorHandler);

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`\n🚀 SiliconMotives API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `   Client URL:  ${process.env.CLIENT_URL || "http://localhost:3000"}\n`,
  );
});
