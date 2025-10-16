module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    action: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
  });

  Permission.associate = (models) => {
    Permission.belongsTo(models.Menu, { foreignKey: 'menuId' });
    Permission.belongsToMany(models.Role, { through: models.RoleMenuPermission });
  };

  return Permission;
};
