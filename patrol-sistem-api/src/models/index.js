const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const models = {
  Role: require('./role.model')(sequelize, DataTypes),
  Menu: require('./menu.model')(sequelize, DataTypes),
  Permission: require('./permission.model')(sequelize, DataTypes),
  RoleMenuPermission: require('./role_menu_permission.model')(sequelize, DataTypes),
  User: require('./user.model')(sequelize, DataTypes),
  Location: require('./location.model')(sequelize, DataTypes),
  PatrolActivity: require('./patrol_activity.model')(sequelize, DataTypes),
  Employee: require('./employee.model')(sequelize, DataTypes),
  LocationType: require('./location_type.model')(sequelize, DataTypes),
  Schedule: require('./schedule.model')(sequelize, DataTypes),
  Shift: require('./shift.model')(sequelize, DataTypes)
};

const { Role, Menu, Permission, RoleMenuPermission, User, Location, PatrolActivity, Employee, LocationType, Schedule, Shift } = models;

// Employee ↔ User
User.hasOne(Employee, { foreignKey: 'user_id' });
Employee.belongsTo(User, { foreignKey: 'user_id' });

// Role ↔ User
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// Menu self reference
Menu.belongsTo(Menu, { as: 'parent', foreignKey: 'parentId' });
Menu.hasMany(Menu, { as: 'children', foreignKey: 'parentId' });

// Role ↔ Menu (many-to-many)
Role.belongsToMany(Menu, {
  through: { model: RoleMenuPermission, unique: false },
  foreignKey: 'role_id',
  otherKey: 'menu_id',
});

Menu.belongsToMany(Role, {
  through: { model: RoleMenuPermission, unique: false },
  foreignKey: 'menu_id',
  otherKey: 'role_id',
});

// RoleMenuPermission detailed relations
RoleMenuPermission.belongsTo(Role, { foreignKey: 'role_id' });
RoleMenuPermission.belongsTo(Menu, { foreignKey: 'menu_id' });
RoleMenuPermission.belongsTo(Permission, { foreignKey: 'permission_id' });

Menu.hasMany(RoleMenuPermission, { foreignKey: 'menu_id' });
Permission.hasMany(RoleMenuPermission, { foreignKey: 'permission_id' });
Role.hasMany(RoleMenuPermission, { foreignKey: 'role_id' });

// PatrolActvity ↔ Location
PatrolActivity.belongsTo(Location, { foreignKey: 'location_id' });
PatrolActivity.belongsTo(User, { foreignKey: 'check_by' });

// LocationType ↔ Location
Location.belongsTo(LocationType, { foreignKey: 'location_type_id' });

// LocationType ↔ Schedule
Schedule.belongsTo(LocationType, { foreignKey: 'location_type_id' });

// Schedule ↔ User (checker)
Schedule.belongsTo(User, { foreignKey: 'checker_id' });

// Shift ↔ Schedule
Schedule.belongsTo(Shift, { foreignKey: 'shift_id' });


models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
