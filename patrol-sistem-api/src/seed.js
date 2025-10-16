const bcrypt = require('bcryptjs');
const { sequelize, Role, Permission, User } = require('./models');

(async () => {
  try {
    await sequelize.sync({ alter: true });

    // --- ROLE SEEDER ---
    const roles = [
      { name: 'admin', description: 'Full access' },
      { name: 'supervisor', description: 'Limited edit' },
      { name: 'user', description: 'Read-only' },
    ];
    await Role.bulkCreate(roles, { ignoreDuplicates: true });
    console.log('✅ Roles seeded');

    // --- PERMISSION SEEDER ---
    const permissions = [
      { name: 'View', code: 'view', description: 'Melihat data' },
      { name: 'Create', code: 'create', description: 'Menambah data' },
      { name: 'Edit', code: 'edit', description: 'Mengubah data' },
      { name: 'Delete', code: 'delete', description: 'Menghapus data' },
      { name: 'Print', code: 'print', description: 'Mencetak report' },
    ];
    await Permission.bulkCreate(permissions, { ignoreDuplicates: true });
    console.log('✅ Permissions seeded');

    // --- ADMIN USER DEFAULT ---
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const [adminUser, created] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        password: hashedPassword,
        role_id: adminRole.id,
      },
    });

    if (created) {
      console.log('✅ Default admin user created:');
    } else {
      console.log('ℹ️ Default admin user already exists:');
    }
    console.log('   Username: admin');
    console.log('   Password: admin123');

    console.log('🎉 Seeder selesai!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder gagal:', err);
    process.exit(1);
  }
})();
