module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('schedule', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    schedule_date: { 
      type: DataTypes.DATEONLY, 
      allowNull: false 
    },
    shift_id: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      defaultValue: 1,
    },
    location_type_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      defaultValue: 1,
    },
    checker_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    tableName: 'schedule',
    timestamps: true,
  });

  return Schedule;
};
