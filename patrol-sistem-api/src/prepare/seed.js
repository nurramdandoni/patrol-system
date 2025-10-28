const bcrypt = require('bcryptjs');
const { sequelize, Role, Permission, User, Menu } = require('../models');

(async () => {
  try {
    // sinkronisasi schema dulu
    await sequelize.sync({ alter: true });

    // --- ROLE SEEDER ---
    const roles = [
      { name: 'admin', description: 'Full access to all menus and permissions' },
      { name: 'supervisor', description: 'Can view and edit limited data' },
      { name: 'user', description: 'Read-only access' },
    ];
    for (const role of roles) {
      await Role.findOrCreate({ where: { name: role.name }, defaults: role });
    }
    console.log('✅ Roles seeded');

    // --- PERMISSION SEEDER ---
    const permissions = [
      { action: 'view', description: 'Melihat data' },
      { action: 'create', description: 'Menambah data' },
      { action: 'edit', description: 'Mengubah data' },
      { action: 'delete', description: 'Menghapus data' },
      { action: 'print', description: 'Mencetak report' },
    ];
    for (const perm of permissions) {
      await Permission.findOrCreate({ where: { action: perm.action }, defaults: perm });
    }
    console.log('✅ Permissions seeded');

    // --- MENU SEEDER ---
    const menus = [
      { name: 'Dashboard', path: '/dashboard', icon:'', index:'1'},
      { name: 'Profile', path: '/profile', icon:'', index:'2',},
      { name: 'Patrol', path: '/patrol', icon:'', index:'3'},
      { name: 'Location', path: '/admin/location', icon:'', index:'4',},
    ];
    for (const men of menus) {
      await Menu.findOrCreate({ where: { name: men.name }, defaults: men });
    }
    console.log('✅ Menus seeded');

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
      console.log('✅ Default admin user created');
    } else {
      console.log('ℹ️ Default admin user already exists');
    }

    console.log('----------------------------------');
    console.log('Username : admin');
    console.log('Password : admin123');
    console.log('Role     : admin');
    console.log('----------------------------------');
    console.log('🎉 Seeder selesai!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder gagal:', err);
    process.exit(1);
  }
})();
