const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const models = {
  Role: require('./role.model')(sequelize, DataTypes),
  Menu: require('./menu.model')(sequelize, DataTypes),
  Permission: require('./permission.model')(sequelize, DataTypes),
  RoleMenuPermission: require('./role_menu_permission.model')(sequelize, DataTypes),
  User: require('./user.model')(sequelize, DataTypes),
};

// Jalankan semua associate()
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
