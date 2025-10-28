module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('location', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    images: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    tableName: 'location',
    timestamps: true,
  });

  return Location;
};
