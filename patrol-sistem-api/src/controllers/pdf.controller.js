const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const checkPermission = require("../utils/checkPermission");

exports.generateLocationPDF = async (req, res) => {
  try {
    const menuId = 3;                       // /admin/location
    const permissionId = [5];               // 1 view 2 create, 3 edit, 4 delete, 5 print
    // validasi akses
    const allowed = await checkPermission(menuId, permissionId, req.user);
    if (!allowed) {
      return res.status(401).json({
        status: 'Access',
        message: 'Access Not Allowed',
      });
    }

    const { data } = req.body;
    const doc = new PDFDocument({ margin: 10 });

    // Header PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=barcode.pdf");

    doc.pipe(res);

    // Sedikit jarak di awal
    doc.moveDown(1);

    // Ukuran dan posisi QR
    const qrWidth = 250;
    const qrHeight = 250;
    const pageWidth = doc.page.width;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const qrData = await QRCode.toDataURL(item.qr_value || "N/A");
      const imgBuffer = Buffer.from(qrData.split(",")[1], "base64");

      // Posisi horizontal tengah QR
      const x = (pageWidth - qrWidth) / 2;

      // Posisi vertikal atas / bawah (disesuaikan agar nama tidak keluar halaman)
      const position = i % 2; // 0 = atas, 1 = bawah
      const y = position === 0 ? 80 : 450; // cukup ruang di bawah QR

      // Gambar QR code
      doc.image(imgBuffer, x, y, { width: qrWidth, height: qrHeight });

      // Hitung posisi teks agar tetap di tengah QR
      const textWidth = doc.widthOfString(item.name || "Tanpa Nama");
      const textX = (pageWidth - textWidth) / 2;
      const textY = y + qrHeight + 10;

      // Tampilkan teks di bawah QR
      doc.fontSize(16).text(item.name || "Tanpa Nama", textX, textY);

      // Jika sudah 2 QR per halaman → halaman baru
      if (position === 1 && i < data.length - 1) {
        doc.addPage();
        doc.moveDown(2);
      }
    }

    doc.end();
  } catch (err) {
    res.status(500).json({
      message: "Gagal membuat PDF",
      error: err.message,
    });
  }
};
