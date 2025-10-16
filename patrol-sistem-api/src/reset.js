const sequelize = require('./config/database');

(async () => {
  await sequelize.drop(); // hapus semua tabel
  console.log('🧹 Semua tabel di-drop');
  await sequelize.sync({ force: true }); // bikin ulang semua tabel
  console.log('✅ Database disinkron ulang');
  process.exit(0);
})();
