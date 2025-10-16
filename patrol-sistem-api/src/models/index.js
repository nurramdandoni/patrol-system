const sequelize = require('../config/database');
const Role = require('./role.model');
const Menu = require('./menu.model');
const Permission = require('./permission.model');
const RoleMenuPermission = require('./roleMenuPermission.model');
const User = require('./user.model');

// Associations
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

module.exports = {
  sequelize,
  Role,
  Menu,
  Permission,
  RoleMenuPermission,
  User,
};
