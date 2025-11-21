const { RoleMenuPermission, Permission } = require('../models');

/**
 * Mengecek apakah user punya izin terhadap menu dan permission tertentu
 * @param {number} menuId - ID menu (misal: 4)
 * @param {Array<number>} permissionIds - Array ID permission yg diperlukan (misal: [1, 2])
 * @param {object} user - user object dari JWT (wajib punya role_id)
 * @returns {Promise<boolean>} - true jika diizinkan, false jika tidak
 */
async function checkPermission(menuId, permissionIds, user) {
  try {
    if (!user || !user.role_id) return false;

    const rolePermissions = await RoleMenuPermission.findAll({
      where: { role_id: user.role_id, menu_id: menuId, status:1 },
      include: [{ model: Permission }],
    });

    if (rolePermissions.length === 0) return false;

    const havingPermission = rolePermissions.map(p => p.permission.id);
    const hasAllPermissions = permissionIds.every(id => havingPermission.includes(id));

    return hasAllPermissions;
  } catch (err) {
    console.error('Error checking permission:', err);
    return false;
  }
}

module.exports = checkPermission;
