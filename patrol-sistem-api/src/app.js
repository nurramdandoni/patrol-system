const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('RBAC Service Running'));

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');
  } catch (err) {
    console.error('❌ Database sync failed:', err);
  }
})();

module.exports = app;
