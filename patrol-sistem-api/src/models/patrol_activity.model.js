module.exports = (sequelize, DataTypes) => {
  const PatrolActivity = sequelize.define('patrol_activity', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    check_date: { type: DataTypes.DATE, allowNull: false },
    location_id: { type: DataTypes.INTEGER, allowNull: false },
    check_notes: { type: DataTypes.STRING, allowNull: false },
    check_image: { type: DataTypes.STRING, allowNull: false },
    check_by: { type: DataTypes.INTEGER, allowNull: false },
    check_status: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
  });

  return PatrolActivity;
};
