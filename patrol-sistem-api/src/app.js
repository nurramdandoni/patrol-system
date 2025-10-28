const express = require('express');
const cors = require('cors');
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

const guard = require('../src/middleware/auth.middleware');


// Konfigurasi storage dengan nama file SHA1 random
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder tetap "uploads/"
  },
  filename: function (req, file, cb) {
    const sha1 = crypto
      .createHash("sha1")
      .update(file.originalname + Date.now().toString())
      .digest("hex");

    const ext = path.extname(file.originalname); // ambil ekstensi asli
    const fileName = `${sha1}${ext}`;

    req.uploadedFileName = fileName;
    cb(null, fileName);
  }
});

// Inisialisasi multer pakai storage custom
const upload = multer({ storage });

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Tangani kesalahan yang dilemparkan oleh Multer
    return res.status(400).json({ message: "Maksimal Upload 1 File!" });
  }
  // Jika bukan kesalahan Multer, teruskan ke error handler berikutnya
  next(err);
};

// API Upload
app.post(
  "/upload",
  guard.verifyAuth,
  upload.single("fileData"),
  multerErrorHandler,
  async (req, res) => {
    

    // kirim file
    const fullFilePath = path.join(__dirname, "uploads", req.uploadedFileName);
    console.log(fullFilePath);
    
    try {

        return res.json({
          folder: "uploads",
          fileName: req.uploadedFileName,
          pathLocation:"uploads/"+req.uploadedFileName,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Gagal Upload File' });
    }

    // 
  }
);

app.get('/', (req, res) => res.send('RBAC Service Running'));

const authRoutes = require('./routes/auth.routes');
const patrolRoutes = require('./routes/patrol.routes')
const locationRoutes = require('./routes/location.routes');
const patrolActivityRoutes = require('./routes/patrol_activity.routes');
// const dashboardRoutes = require('./routes/dashboard.routes');

app.use('/auth', authRoutes);
app.use('/admin', locationRoutes);
app.use('/admin', patrolActivityRoutes);
app.use('/patrol', patrolRoutes);
// app.use('/dashboard', dashboardRoutes);

module.exports = app;
