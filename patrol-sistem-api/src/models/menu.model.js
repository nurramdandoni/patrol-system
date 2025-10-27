module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define('menu', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    icon: DataTypes.STRING,
    index: DataTypes.INTEGER,
    parentId: DataTypes.INTEGER,
  });

  return Menu;
};
