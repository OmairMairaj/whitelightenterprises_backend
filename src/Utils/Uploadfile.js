const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "whitelight_categories", // ✅ Cloudinary will create this folder if it doesn't exist
        allowed_formats: ["jpg", "png", "webp", "gif"], // ✅ Allowed file types
        public_id: (req, file) => Date.now() + "-" + file.originalname.replace(/\s+/g, "_"),
        use_filename: true, // ✅ Keep original filename
        unique_filename: false, // ✅ Prevent random renaming
    },
});

// Initialize Multer with Cloudinary Storage
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // ✅ Limit file size to 5MB
});

module.exports = upload;
