module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('permission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    action: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
  });

  return Permission;
};
