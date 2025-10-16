const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permission = sequelize.define('permission', {
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, unique: true },
  description: { type: DataTypes.STRING },
});

module.exports = Permission;
