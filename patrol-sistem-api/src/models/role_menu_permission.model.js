module.exports = (sequelize, DataTypes) => {
  const RoleMenuPermission = sequelize.define('RoleMenuPermission', {
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    menu_id: { type: DataTypes.INTEGER, allowNull: false },
    permission_id: { type: DataTypes.INTEGER, allowNull: false },
  });

  RoleMenuPermission.associate = (models) => {
    RoleMenuPermission.belongsTo(models.Role, { foreignKey: 'role_id' });
    RoleMenuPermission.belongsTo(models.Menu, { foreignKey: 'menu_id' });
    RoleMenuPermission.belongsTo(models.Permission, { foreignKey: 'permission_id' });
  };

  return RoleMenuPermission;
};
