const cloudinary = require("../config/cloudinary");
const multer = require("multer");

/**
 * Multer memory storage — files held in buffer, uploaded directly to Cloudinary.
 * More efficient than disk storage + re-upload.
 */
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, WebP, and SVG images are allowed"), false);
    }
  },
});

/**
 * Helper: Upload a buffer to Cloudinary.
 * Returns a promise with the Cloudinary response.
 */
const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "siliconmotives",
        resource_type: "image",
        quality: "auto:good",
        format: "webp",
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * POST /api/upload
 * Upload a single image to Cloudinary (admin only).
 * Returns the Cloudinary URL.
 */
exports.uploadMiddleware = upload.single("image");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/upload/:publicId
 * Delete an image from Cloudinary (admin only).
 */
exports.deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: "Image deleted",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
