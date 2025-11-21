const express = require('express');
const cors = require('cors');
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const app = express();

// CORS Configuration - FIXED
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:4000',
      'http://localhost:3000',
      'http://210.79.191.133:4000',
      'http://210.79.191.133',
      'https://kinenta-guard.paylite.co.id',  // ← Cek domain Anda yang benar
      'http://security-kinenta.paylite.co.id'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);  // Debug
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400  // Cache preflight for 24 hours
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
// app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
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

// API UPload File Base 64
app.post('/upload-base64', guard.verifyAuth, async (req, res) => {
  try {
    const { base64Data } = req.body;

    if (!base64Data) {
      return res.status(400).json({ error: 'Base64 data tidak ditemukan' });
    }

    // Validasi format base64
    const matches = base64Data.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Format base64 tidak valid' });
    }

    const mimeType = matches[1];
    const imageData = matches[2];
    const ext = mimeType.split('/')[1];

    // Nama file acak (hash)
    const sha1 = crypto
      .createHash('sha1')
      .update(Date.now().toString() + Math.random().toString())
      .digest('hex');

    const fileName = `${sha1}.${ext}`;
    const uploadsDir = path.join(__dirname, '../uploads');
    const filePath = path.join(uploadsDir, fileName);

    // ✅ Pastikan folder uploads ada
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Simpan file
    const buffer = Buffer.from(imageData, 'base64');
    fs.writeFileSync(filePath, buffer);

    return res.json({
      folder: 'uploads',
      fileName,
      pathLocation: 'uploads/' + fileName,
    });
  } catch (error) {
    console.error('Upload base64 error:', error);
    return res.status(500).json({ error: 'Gagal upload file base64' });
  }
});


app.get('/', (req, res) => res.send('RBAC Service Running'));

const authRoutes = require('./routes/auth.routes');
const patrolRoutes = require('./routes/patrol.routes')
const locationRoutes = require('./routes/location.routes');
const patrolActivityRoutes = require('./routes/patrol_activity.routes');
const employeeRoutes = require('./routes/employee.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const menuRoutes = require('./routes/menu.routes');
const accessRoutes = require('./routes/access.routes');
const pdfRoutes = require('./routes/pdf.routes');
// const dashboardRoutes = require('./routes/dashboard.routes');

app.use('/auth', authRoutes);
app.use('/admin', locationRoutes);
app.use('/admin', employeeRoutes);
app.use('/admin', userRoutes);
app.use('/admin', roleRoutes);
app.use('/admin', menuRoutes);
app.use('/admin', accessRoutes);
app.use('/admin', pdfRoutes);
app.use('/admin', patrolActivityRoutes);
app.use('/patrol', patrolRoutes);
// app.use('/dashboard', dashboardRoutes);

module.exports = app;
