const multer = require("multer");
const path = require("path");
const fs = require('fs');

const uploadDir = path.join(__dirname, "../public/images");

// Cek apakah direktori ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Buat direktori
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/images")); // Lokasi penyimpanan
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/PNG"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only .jpeg or .png images are allowed"));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Batas 5MB
});

module.exports = upload;
