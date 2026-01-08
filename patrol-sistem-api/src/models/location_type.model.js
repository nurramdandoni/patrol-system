module.exports = (sequelize, DataTypes) => {
  const LocationType = sequelize.define('location_type', {
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
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    tableName: 'location_type',
    timestamps: true,
  });

  return LocationType;
};
