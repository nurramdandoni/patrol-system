const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role.model');
const Menu = require('./menu.model');
const Permission = require('./permission.model');

const RoleMenuPermission = sequelize.define('role_menu_permission', {
  role_id: { type: DataTypes.INTEGER, allowNull: false },
  menu_id: { type: DataTypes.INTEGER, allowNull: false },
  permission_id: { type: DataTypes.INTEGER, allowNull: false },
});

RoleMenuPermission.belongsTo(Role, { foreignKey: 'role_id' });
RoleMenuPermission.belongsTo(Menu, { foreignKey: 'menu_id' });
RoleMenuPermission.belongsTo(Permission, { foreignKey: 'permission_id' });

module.exports = RoleMenuPermission;
