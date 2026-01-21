const express = require('express');
const router = express.Router();
const guard = require('../middleware/auth.middleware');
const scheduleController = require('../controllers/schedule.controller');

router.get('/schedule', guard.verifyAuth, scheduleController.getAll);
router.get('/schedule/where', guard.verifyAuth, scheduleController.getAllWhere);
router.get('/schedule/:id', guard.verifyAuth, scheduleController.getById);
router.post('/schedule', guard.verifyAuth, scheduleController.create);
router.put('/schedule/:id', guard.verifyAuth, scheduleController.update);

module.exports = router;
