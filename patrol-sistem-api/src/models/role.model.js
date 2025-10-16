const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('role', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING },
});

module.exports = Role;
