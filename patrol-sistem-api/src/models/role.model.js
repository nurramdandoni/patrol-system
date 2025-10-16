module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.STRING,
  });

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'role_id' });
    Role.belongsToMany(models.Permission, { through: models.RoleMenuPermission });
  };

  return Role;
};
