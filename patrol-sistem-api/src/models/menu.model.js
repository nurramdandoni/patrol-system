module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define('Menu', {
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    icon: DataTypes.STRING,
    parentId: DataTypes.INTEGER,
  });

  Menu.associate = (models) => {
    Menu.hasMany(models.Permission, { foreignKey: 'menuId' });
  };

  return Menu;
};
