const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const patrolActivityController = require('../controllers/patrol_activity.controller');

router.get('/patrol-activity', guard.verifyAuth, patrolActivityController.patrolActivity);
router.get('/dashboard-data', guard.verifyAuth, patrolActivityController.dashboardData);

module.exports = router;
