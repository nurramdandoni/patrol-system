const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('RBAC Service Running'));

const authRoutes = require('./routes/auth.routes');
const patrolRoutes = require('./routes/patrol.routes')
// const dashboardRoutes = require('./routes/dashboard.routes');

app.use('/auth', authRoutes);
app.use('/patrol', patrolRoutes);
// app.use('/dashboard', dashboardRoutes);

module.exports = app;
