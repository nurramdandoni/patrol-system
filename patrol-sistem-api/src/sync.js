const { sequelize } = require('./models');

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Semua tabel berhasil dibuat ulang.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal sync database:', err);
  }
})();
