const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Menu = sequelize.define('menu', {
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, unique: true },
  route: { type: DataTypes.STRING },
  icon: { type: DataTypes.STRING },
  parent_id: { type: DataTypes.INTEGER, allowNull: true },
});

module.exports = Menu;
