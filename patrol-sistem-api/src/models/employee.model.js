module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true, unique: true },
    nip: { type: DataTypes.STRING, allowNull: false },
    full_name: { type: DataTypes.STRING, allowNull: false },
    ttl: { type: DataTypes.DATE, allowNull: false },
    gender: { type: DataTypes.ENUM('male', 'female'), allowNull: false },
    nik: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
  });

  return Employee;
};
