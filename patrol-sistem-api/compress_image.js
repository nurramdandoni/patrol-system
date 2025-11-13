import sharp from 'sharp';

// Contoh kompresi JPEG
// sharp('./iconK.jpeg')
//   .resize(300)              // ubah lebar maksimum
//   .jpeg({ quality: 75 })     // kompres
//   .toFile('output.jpeg')
//   .then(() => console.log('✅ Gambar berhasil dikompres!'));

// Kompresi PNG dengan pengaturan lanjutan
sharp('./iconPolice.png')
  .resize(300) // ubah lebar maksimum (opsional)
  .png({
    compressionLevel: 9, // 0 (tidak kompres) → 9 (maksimal kompres)
    quality: 80,         // tambahkan untuk jaga kualitas (0–100)
    adaptiveFiltering: true
  })
  .toFile('output.png')
  .then(() => console.log('✅ Gambar PNG berhasil dikompres!'))
  .catch(err => console.error('❌ Error:', err));

