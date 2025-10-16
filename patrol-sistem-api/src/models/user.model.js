const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role.model');

const User = sequelize.define('user', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});

User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = User;
