require('dotenv').config();
const sequelize = require('./config/database');
const app = require('./app');

const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');
    const server = app.listen(PORT, () => { console.log(`🚀 Server running on port ${PORT}`);});

    server.on('close', () => console.log('❌ Server closed'));
    server.on('error', (err) => console.error('❌ Server error:', err));

  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
})();

