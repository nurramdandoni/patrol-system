module.exports = (sequelize, DataTypes) => {
  const RoleMenuPermission = sequelize.define('role_menu_permission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
    menu_id: { type: DataTypes.INTEGER, allowNull: false },
    permission_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {type: DataTypes.TINYINT,allowNull: false,defaultValue: 0},
  });

  return RoleMenuPermission;
};
